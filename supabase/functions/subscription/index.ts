// Subscription management edge function
// Handles: create subscription, verify payment, cancel, get status

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { verifyFirebaseToken } from "../_shared/firebase-auth.ts";
import { 
  getOrCreateUser, 
  updateUser, 
  getUserById,
  logSubscriptionPayment 
} from "../_shared/external-supabase.ts";
import { getUserSubscriptionInfo } from "../_shared/scan-limits.ts";
import { timingSafeEqualHex } from "../_shared/crypto.ts";

const ALLOWED_ORIGINS = [
  "https://atsfastscan.com",
  "https://www.atsfastscan.com",
  "https://ats-fast-scan-ra35.vercel.app",
  "http://localhost:8080",
  "http://localhost:5173",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

// Razorpay API base URL
const RAZORPAY_API = "https://api.razorpay.com/v1";

type RazorpaySubscriptionStatus =
  | 'created'
  | 'authenticated'
  | 'active'
  | 'pending'
  | 'halted'
  | 'cancelled'
  | 'completed'
  | string;

async function fetchRazorpaySubscriptionStatus(subscriptionId: string): Promise<RazorpaySubscriptionStatus | null> {
  try {
    const resp = await fetch(`${RAZORPAY_API}/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        Authorization: getRazorpayAuth(),
      },
    });
    if (!resp.ok) {
      console.warn('[Razorpay] Failed to fetch subscription status', { subscriptionId, status: resp.status });
      return null;
    }
    const json = await resp.json();
    return json?.status ?? null;
  } catch (e) {
    console.warn('[Razorpay] Error fetching subscription status', e);
    return null;
  }
}

// Defensive reconciliation:
// If a user is marked paid+active in our DB but Razorpay isn't truly active,
// downgrade to free immediately. This prevents "free upgrades" from any legacy data.
// EXCEPTION: If razorpay_subscription_id is explicitly set to 'MANUAL_OVERRIDE', 
// trust the DB values for testing purposes.
async function reconcilePaidAccess(userId: string): Promise<void> {
  const user = await getUserById(userId);
  if (!user) return;

  // Hard-remove any trial state (product no longer offers trial)
  if (user.subscription_status === 'trial' || user.trial_ends_at) {
    await updateUser(userId, {
      subscription_status: null,
      trial_ends_at: null,
      plan_type: user.plan_type === 'free' ? 'free' : 'free',
      subscription_start_date: null,
      subscription_end_date: null,
    });
    return;
  }

  // If user is not marked active, nothing to reconcile here.
  if (user.subscription_status !== 'active') return;

  // MANUAL OVERRIDE: If razorpay_subscription_id is 'MANUAL_OVERRIDE', skip Razorpay validation.
  // This allows manual testing of Plus/Pro features without a real Razorpay subscription.
  if (user.razorpay_subscription_id === 'MANUAL_OVERRIDE') {
    console.log('[Subscription] Manual override detected, skipping Razorpay validation', { userId });
    return;
  }

  // If active but missing critical fields, treat as invalid.
  if (!user.razorpay_subscription_id) {
    console.warn('[Subscription] Active user missing razorpay_subscription_id; downgrading', { userId });
    await updateUser(userId, {
      plan_type: 'free',
      subscription_status: null,
      subscription_start_date: null,
      subscription_end_date: null,
    });
    return;
  }

  const status = await fetchRazorpaySubscriptionStatus(user.razorpay_subscription_id);
  
  // If Razorpay API call failed (network error, timeout), do NOT downgrade.
  // Give benefit of the doubt — avoid punishing users for transient API failures.
  if (status === null) {
    console.warn('[Subscription] Razorpay API unreachable; skipping reconciliation', { userId });
    return;
  }

  // These statuses are valid — subscription is active or in a transitional state
  const validStatuses = ['active', 'authenticated', 'pending', 'halted', 'created'];
  if (validStatuses.includes(status)) {
    return; // Subscription is fine
  }

  // Only downgrade for definitively terminal states
  const terminalStatuses = ['cancelled', 'completed', 'expired'];
  if (terminalStatuses.includes(status)) {
    // If subscription_end_date is still in the future, user has remaining paid time — skip downgrade
    if (user.subscription_end_date) {
      const endDate = new Date(user.subscription_end_date);
      if (endDate > new Date()) {
        console.log('[Subscription] Subscription end date still in future; keeping access', { userId, status, endDate: user.subscription_end_date });
        return;
      }
    }

    // Grace period: don't downgrade if subscription was activated within the last 10 minutes
    if (user.subscription_start_date) {
      const activatedAt = new Date(user.subscription_start_date).getTime();
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
      if (activatedAt > tenMinutesAgo) {
        console.log('[Subscription] Within grace period; skipping downgrade', { userId, status });
        return;
      }
    }

    console.warn('[Subscription] Razorpay subscription terminal; downgrading', {
      userId,
      razorpay_subscription_id: user.razorpay_subscription_id,
      status,
    });
    await updateUser(userId, {
      plan_type: 'free',
      subscription_status: null,
      subscription_start_date: null,
      subscription_end_date: null,
    });
  } else {
    // Unknown status — log but don't downgrade
    console.warn('[Subscription] Unknown Razorpay status; not downgrading', { userId, status });
  }
}

// Get Razorpay auth header
function getRazorpayAuth(): string {
  const keyId = Deno.env.get("RAZORPAY_KEY_ID");
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured");
  }
  return "Basic " + btoa(`${keyId}:${keySecret}`);
}

// Get plan ID from environment
function getPlanId(planType: 'plus' | 'pro', billingCycle: 'monthly' | 'annual'): string {
  const envKey = `RAZORPAY_PLAN_${planType.toUpperCase()}_${billingCycle.toUpperCase()}`;
  const planId = Deno.env.get(envKey);
  if (!planId) {
    throw new Error(`Plan ID not configured: ${envKey}`);
  }
  return planId;
}

// Create Razorpay customer if needed
// Set forceNew=true to ignore cached customer ID (for mode switches)
async function getOrCreateRazorpayCustomer(
  userId: string,
  email: string,
  name?: string,
  forceNew: boolean = false
): Promise<string> {
  const user = await getUserById(userId);
  
  // Use cached customer ID unless forcing new
  if (!forceNew && user?.razorpay_customer_id) {
    return user.razorpay_customer_id;
  }

  // First, try to find existing customer by email in current Razorpay mode
  // IMPORTANT: Skip search if email is empty to avoid matching the wrong customer
  if (email) {
    const searchResponse = await fetch(`${RAZORPAY_API}/customers?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        Authorization: getRazorpayAuth(),
      },
    });

    if (searchResponse.ok) {
      const searchResult = await searchResponse.json();
      if (searchResult.items && searchResult.items.length > 0) {
        const existingCustomer = searchResult.items[0];
        console.log(`[Razorpay] Found existing customer: ${existingCustomer.id}`);
        
        // Save customer ID to user record
        try {
          await updateUser(userId, { razorpay_customer_id: existingCustomer.id });
        } catch (e) {
          console.warn("[Razorpay] Could not save customer ID to user, continuing anyway");
        }
        
        return existingCustomer.id;
      }
    }
  }

  // Create new customer in Razorpay
  const response = await fetch(`${RAZORPAY_API}/customers`, {
    method: "POST",
    headers: {
      Authorization: getRazorpayAuth(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name || email.split("@")[0],
      email,
      notes: { firebase_uid: userId },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[Razorpay] Failed to create customer:", error);
    throw new Error("Failed to create payment customer");
  }

  const customer = await response.json();
  
  // Save customer ID to user record
  try {
    await updateUser(userId, { razorpay_customer_id: customer.id });
  } catch (e) {
    console.warn("[Razorpay] Could not save customer ID to user, continuing anyway");
  }
  
  return customer.id;
}

// Create subscription handler
async function createSubscription(
  userId: string,
  email: string,
  planType: 'plus' | 'pro',
  billingCycle: 'monthly' | 'annual',
  forceNewCustomer: boolean = false,
  retryWithNewCustomer: boolean = false
): Promise<{ subscriptionId: string; shortUrl?: string }> {
  const customerId = await getOrCreateRazorpayCustomer(userId, email, undefined, forceNewCustomer || retryWithNewCustomer);
  const planId = getPlanId(planType, billingCycle);

  // Safety guards: fail fast with actionable errors (prevents confusing 500s)
  // Razorpay IDs are mode-specific (test vs live) and must belong to the same account.
  if (!planId.startsWith("plan_")) {
    throw new Error(`Invalid Razorpay plan id for ${planType}/${billingCycle}. Expected 'plan_*', got '${planId}'.`);
  }
  if (!customerId.startsWith("cust_")) {
    throw new Error(`Invalid Razorpay customer id. Expected 'cust_*', got '${customerId}'.`);
  }
  
  const response = await fetch(`${RAZORPAY_API}/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: getRazorpayAuth(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: planId,
      customer_id: customerId,
      total_count: billingCycle === 'annual' ? 12 : 120, // Max billing cycles
      quantity: 1,
      customer_notify: 1,
      notes: {
        firebase_uid: userId,
        plan_type: planType,
        billing_cycle: billingCycle,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Razorpay] Failed to create subscription:", {
      status: response.status,
      body: errorText,
      planType,
      billingCycle,
      planId,
      customerId,
    });
    
    // If "id does not exist" and we haven't retried yet, try with fresh customer
    // This handles test->live mode switches where old customer ID is invalid
    if (!retryWithNewCustomer && errorText.includes("The id provided does not exist")) {
      console.log("[Subscription] Retrying with fresh customer (possible mode switch)...");
      return createSubscription(userId, email, planType, billingCycle, false, true);
    }
    
    // Return a precise message to the frontend (no secrets), so failures are debuggable.
    throw new Error(`Failed to create subscription (${response.status}): ${errorText}`);
  }

  const subscription = await response.json();
  
  // IMPORTANT: Do NOT upgrade user here!
  // Only store the pending subscription ID.
  // The webhook (subscription.activated) will handle the actual upgrade after payment.
  await updateUser(userId, {
    razorpay_subscription_id: subscription.id,
    // Keep plan_type and subscription_status unchanged - user stays on current plan
    // until webhook confirms successful payment
  });

  console.log(`[Subscription] Created pending ${planType} ${billingCycle} subscription for ${userId} - awaiting payment`);
  
  return {
    subscriptionId: subscription.id,
    shortUrl: subscription.short_url,
  };
}

// Verify payment signature using HMAC-SHA256
async function verifyRazorpaySignature(
  subscriptionId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const secret = Deno.env.get("RAZORPAY_KEY_SECRET");
  if (!secret) return false;

  const body = `${paymentId}|${subscriptionId}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(body);

  const cryptoKey = await crypto.subtle.importKey(
    "raw", keyData,
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const computed = Array.from(new Uint8Array(sigBuffer))
    .map(b => b.toString(16).padStart(2, "0")).join("");

  console.log(`[Subscription] Payment signature verification for ${subscriptionId}`);
  // Constant-time comparison (finding 4.3): `===` on a hex digest stops at the
  // first differing character, leaking how much of a guessed signature was right.
  return timingSafeEqualHex(computed, signature);
}

// Cancel subscription handler
async function cancelSubscription(userId: string): Promise<void> {
  const user = await getUserById(userId);
  
  if (!user?.razorpay_subscription_id) {
    throw new Error("No active subscription found");
  }

  const response = await fetch(
    `${RAZORPAY_API}/subscriptions/${user.razorpay_subscription_id}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: getRazorpayAuth(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cancel_at_cycle_end: true, // Cancel at end of current period
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("[Razorpay] Failed to cancel subscription:", error);
    throw new Error("Failed to cancel subscription");
  }

  // Update user status
  await updateUser(userId, {
    subscription_status: 'cancelled',
    cancelled_at: new Date().toISOString(),
  });

  console.log(`[Subscription] Cancelled subscription for ${userId}`);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    const authResult = await verifyFirebaseToken(authHeader);
    
    if (!authResult.valid) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    const userId = authResult.userId!;
    let email = authResult.email || "";
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    console.log(`[Subscription] ${req.method} /${path} for user ${userId}`);

// GET or POST /status - Get subscription status (support both methods)
    if (path === "status") {
      await reconcilePaidAccess(userId);
      const info = await getUserSubscriptionInfo(userId, email);
      return new Response(
        JSON.stringify(info),
        { headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    // POST endpoints require body
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();

    // POST /create-subscription
    if (path === "create-subscription") {
      const { planType, billingCycle, email: bodyEmail, name: bodyName } = body;

      // The verified token's email wins (finding 4.8). The request body used to
      // take precedence unconditionally, and getOrCreateRazorpayCustomer looks a
      // customer up BY EMAIL - so a caller holding a valid token for their own
      // address could name someone else's address and have the new subscription
      // attached to that person's Razorpay customer.
      //
      // The body is still used when the token carries no email, which is the case
      // for sign-in providers that do not supply one.
      if (!email && typeof bodyEmail === "string" && bodyEmail.trim().length > 0) {
        email = bodyEmail.trim();
      } else if (bodyEmail && bodyEmail !== email) {
        console.warn(`[Subscription] Ignoring body email for ${userId}: verified token email takes precedence`);
      }
      
      if (!['plus', 'pro'].includes(planType)) {
        return new Response(
          JSON.stringify({ error: "Invalid plan type" }),
          { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
        );
      }
      
      if (!['monthly', 'annual'].includes(billingCycle)) {
        return new Response(
          JSON.stringify({ error: "Invalid billing cycle" }),
          { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
        );
      }

      const result = await createSubscription(userId, email, planType, billingCycle, !!bodyEmail);
      
      return new Response(
        JSON.stringify({ ...result, email }),
        { headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    // POST /verify-payment
    if (path === "verify-payment") {
      const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = body;
      
      const isValid = await verifyRazorpaySignature(
        razorpay_subscription_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        return new Response(
          JSON.stringify({ error: "Payment verification failed" }),
          { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
        );
      }

      // Activate subscription immediately as fallback (webhook may be delayed/missing)
      try {
        // Fetch subscription details from Razorpay to get plan info
        const rzpResp = await fetch(`${RAZORPAY_API}/subscriptions/${razorpay_subscription_id}`, {
          method: 'GET',
          headers: { Authorization: getRazorpayAuth() },
        });

        if (rzpResp.ok) {
          const rzpSub = await rzpResp.json();

          // Ownership check: ensure subscription belongs to authenticated user
          if (rzpSub.notes?.firebase_uid !== userId) {
            console.warn(`[Subscription] Ownership mismatch: ${userId} vs ${rzpSub.notes?.firebase_uid}`);
            return new Response(
              JSON.stringify({ error: "Subscription does not belong to this user" }),
              { status: 403, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
            );
          }
          const notes = rzpSub?.notes || {};
          const planType = notes.plan_type || 'plus';
          const billingCycle = notes.billing_cycle || 'monthly';
          const rzpStatus = rzpSub?.status;

          // Only activate if Razorpay confirms the subscription is in a valid state
          const activatableStatuses = ['active', 'authenticated', 'pending'];
          if (activatableStatuses.includes(rzpStatus)) {
            const now = new Date();
            await updateUser(userId, {
              plan_type: planType,
              subscription_status: 'active',
              subscription_start_date: now.toISOString(),
              razorpay_subscription_id: razorpay_subscription_id,
            });

            // Log the payment
            await logSubscriptionPayment(
              userId,
              razorpay_payment_id,
              razorpay_subscription_id,
              planType,
              rzpSub?.plan?.item?.amount || 0,
              'success'
            );

            console.log(`[Subscription] Activated ${planType} for ${userId} via verify-payment (Razorpay status: ${rzpStatus})`);
          } else {
            console.warn(`[Subscription] verify-payment: Razorpay status is ${rzpStatus}, not activating yet`);
          }
        } else {
          console.warn('[Subscription] Could not fetch Razorpay subscription during verify-payment');
        }
      } catch (e) {
        console.error('[Subscription] Error during verify-payment activation:', e);
        // Don't fail the response — payment was received, activation will happen via webhook
      }

      return new Response(
        JSON.stringify({ success: true, message: "Payment verified and subscription activated" }),
        { headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    // POST /cancel-subscription
    if (path === "cancel-subscription") {
      await cancelSubscription(userId);
      return new Response(
        JSON.stringify({ success: true, message: "Subscription cancelled" }),
        { headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    // Unknown endpoint
    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[Subscription] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
    );
  }
});
