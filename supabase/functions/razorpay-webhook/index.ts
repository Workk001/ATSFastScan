// Razorpay Webhook Handler
// Handles subscription lifecycle events

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { updateUser, getUserById, logSubscriptionPayment, getExternalSupabaseClient } from "../_shared/external-supabase.ts";

import { captureServerException } from "../_shared/posthog.ts";
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

// Verify Razorpay webhook signature
async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<boolean> {
  const secret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
  if (!secret) {
    console.error("[Webhook] RAZORPAY_WEBHOOK_SECRET not configured");
    await captureServerException(
      "razorpay-webhook",
      new Error("RAZORPAY_WEBHOOK_SECRET not configured"),
      { source: "razorpay-webhook", stage: "signature_verification" }
    );
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(body);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      messageData
    );

    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Constant-time comparison (finding 4.3): `===` on a hex digest stops at the
    // first differing character, which leaks how much of a guessed signature was
    // correct and can be walked character by character.
    return timingSafeEqualHex(computedSignature, signature);
  } catch (error) {
    console.error("[Webhook] Signature verification error:", error);
    await captureServerException("razorpay-webhook", error, {
      source: "razorpay-webhook",
      stage: "signature_verification",
    });
    return false;
  }
}

interface RazorpayPaymentEntity {
  id: string;
  amount: number;
  notes?: Record<string, string>;
}

interface RazorpaySubscriptionEntity {
  id: string;
  notes?: Record<string, string>;
}

interface RazorpayWebhookPayload {
  payment?: {
    entity?: RazorpayPaymentEntity;
  };
  subscription?: {
    entity?: RazorpaySubscriptionEntity;
  };
}

// Extract user ID from subscription notes
function extractUserIdFromNotes(notes: Record<string, string> | undefined): string | null {
  return notes?.firebase_uid || null;
}

// Handle subscription.activated event
async function handleSubscriptionActivated(payload: RazorpayWebhookPayload): Promise<void> {
  const subscription = payload.subscription?.entity;
  if (!subscription) return;

  const userId = extractUserIdFromNotes(subscription.notes);
  if (!userId) {
    console.error("[Webhook] No user ID in subscription notes");
    await captureServerException(
      "razorpay-webhook",
      new Error("subscription.activated received without firebase_uid in notes"),
      { source: "razorpay-webhook", event_type: "subscription.activated" }
    );
    return;
  }

  // IMPORTANT:
  // Razorpay can emit subscription.activated before the first successful charge.
  // We must NOT grant paid access here.
  // Paid access is granted only on subscription.charged (successful payment).
  await updateUser(userId, {
    razorpay_subscription_id: subscription.id,
    // Ensure there's no legacy trial granting access.
    trial_ends_at: null,
  });

  console.log(`[Webhook] Received subscription.activated for ${userId} (no access granted until charged)`);
}

// Handle subscription.charged event
async function handleSubscriptionCharged(payload: RazorpayWebhookPayload, eventId?: string): Promise<void> {
  const payment = payload.payment?.entity;
  const subscription = payload.subscription?.entity;
  
  if (!subscription) return;

  const userId = extractUserIdFromNotes(subscription.notes);
  if (!userId) {
    console.error("[Webhook] No user ID in subscription notes");
    await captureServerException(
      "razorpay-webhook",
      new Error("subscription.charged received without firebase_uid in notes"),
      { source: "razorpay-webhook", event_type: "subscription.charged" }
    );
    return;
  }

  const planType = subscription.notes?.plan_type as 'plus' | 'pro' || 'plus';
  const billingCycle = subscription.notes?.billing_cycle || 'monthly';

  // Log successful payment
  if (payment) {
    await logSubscriptionPayment(
      userId,
      payment.id,
      subscription.id,
      planType,
      payment.amount,
      'success',
      eventId
    );
  }

  // Get current user to check if upgrading from free plan
  const currentUser = await getUserById(userId);
  const isUpgradingFromFree = currentUser?.plan_type === 'free';
  
  // Calculate scan reset logic for free-to-paid upgrade
  let resumeScansUsed = currentUser?.resume_scans_used_this_month || 0;
  let coverLetterScansUsed = currentUser?.cover_letter_scans_used_this_month || 0;
  
  if (isUpgradingFromFree && currentUser) {
    const FREE_RESUME_LIMIT = 2;
    const freeScansRemaining = Math.max(0, FREE_RESUME_LIMIT - resumeScansUsed);
    
    if (freeScansRemaining === 0) {
      // User used all free scans - reset to 0
      resumeScansUsed = 0;
      console.log(`[Webhook] User ${userId} used all free scans - resetting to 0`);
    } else {
      // User has remaining free scans - carry forward as bonus
      // Set negative used count so they get extra scans
      // e.g., if they used 1 of 2 free scans, they have 1 remaining
      // Set used to -1 so their effective remaining = limit - (-1) = limit + 1
      resumeScansUsed = -freeScansRemaining;
      console.log(`[Webhook] User ${userId} has ${freeScansRemaining} free scans remaining - carrying forward as bonus`);
    }
    
    // Cover letter scans always start fresh (free plan has 0 limit)
    coverLetterScansUsed = 0;
  }

  // Set subscription end date from now (simple model: one month/year access per charge)
  const now = new Date();
  const endDate = new Date(now);
  if (billingCycle === 'annual') {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }
  
  // Set next month reset date
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  await updateUser(userId, {
    plan_type: planType,
    subscription_status: 'active',
    subscription_start_date: now.toISOString(),
    subscription_end_date: endDate.toISOString(),
    trial_ends_at: null,
    razorpay_subscription_id: subscription.id,
    // Reset scan counters based on upgrade logic
    resume_scans_used_this_month: resumeScansUsed,
    cover_letter_scans_used_this_month: coverLetterScansUsed,
    month_reset_date: nextMonth.toISOString(),
  });

  console.log(`[Webhook] Charged and extended subscription for ${userId} (resume scans: ${resumeScansUsed}, cover letter scans: ${coverLetterScansUsed})`);
}

// Handle subscription.cancelled event
// User cancelled autopay — keep paid access until subscription_end_date
async function handleSubscriptionCancelled(payload: RazorpayWebhookPayload): Promise<void> {
  const subscription = payload.subscription?.entity;
  if (!subscription) return;

  const userId = extractUserIdFromNotes(subscription.notes);
  if (!userId) {
    console.error("[Webhook] No user ID in subscription notes");
    await captureServerException(
      "razorpay-webhook",
      new Error("subscription.cancelled received without firebase_uid in notes"),
      { source: "razorpay-webhook", event_type: "subscription.cancelled" }
    );
    return;
  }

  // DO NOT downgrade plan_type or subscription_status.
  // The user already paid for the current billing period.
  // Only record cancellation metadata — access continues until subscription_end_date.
  await updateUser(userId, {
    cancelled_at: new Date().toISOString(),
    // subscription_status stays 'active' so access is preserved
    // plan_type stays unchanged
  });

  console.log(`[Webhook] Subscription cancelled for ${userId} — access preserved until period end`);
}

// Handle subscription.completed event (subscription ended)
async function handleSubscriptionCompleted(payload: RazorpayWebhookPayload): Promise<void> {
  const subscription = payload.subscription?.entity;
  if (!subscription) return;

  const userId = extractUserIdFromNotes(subscription.notes);
  if (!userId) {
    await captureServerException(
      "razorpay-webhook",
      new Error("subscription.completed received without firebase_uid in notes"),
      { source: "razorpay-webhook", event_type: "subscription.completed" }
    );
    return;
  }

  // Downgrade to free plan
  await updateUser(userId, {
    plan_type: 'free',
    subscription_status: null,
    razorpay_subscription_id: null,
  });

  console.log(`[Webhook] Subscription completed, downgraded ${userId} to free`);
}

// Handle payment.failed event
async function handlePaymentFailed(payload: RazorpayWebhookPayload, eventId?: string): Promise<void> {
  const payment = payload.payment?.entity;
  if (!payment) return;

  const notes = payment.notes;
  const userId = notes?.firebase_uid;
  
  if (userId) {
    await logSubscriptionPayment(
      userId,
      payment.id,
      notes?.subscription_id || '',
      notes?.plan_type || 'plus',
      payment.amount,
      'failed',
      eventId
    );
    console.log(`[Webhook] Payment failed for ${userId}`);
  }
}

// Claim an event id before any work is done for it. The insert IS the check:
// the primary key on razorpay_event_id makes concurrent deliveries race, and the
// loser gets 23505 and skips. Returns true when this delivery should proceed.
async function claimWebhookEvent(eventId: string, eventType: string): Promise<boolean> {
  const supabase = getExternalSupabaseClient();
  const { error } = await supabase
    .from("webhook_events")
    .insert({ razorpay_event_id: eventId, event_type: eventType });

  if (!error) return true;

  if (error.code === "23505") {
    console.log(`[Webhook] Duplicate event ${eventId} ignored`);
    return false;
  }

  // Anything else is not a duplicate, and processing anyway risks running the
  // event twice. Razorpay retries, so failing the request is the recoverable
  // choice.
  console.error("[Webhook] Could not record event id, refusing to process:", error.code, error.message);
  throw new Error("Could not record webhook event id");
}
// Give back a claim whose handler failed, so Razorpay's retry is not swallowed as
// a duplicate. Only the delivery holding the claim ever calls this.
async function releaseWebhookEvent(eventId: string): Promise<void> {
  const supabase = getExternalSupabaseClient();
  const { error } = await supabase
    .from("webhook_events")
    .delete()
    .eq("razorpay_event_id", eventId);

  if (error) {
    console.error("[Webhook] Could not release the event claim:", error.code, error.message);
  }
}


serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    const signature = req.headers.get("x-razorpay-signature");
    const body = await req.text();

    // Verify webhook signature
    if (!signature || !(await verifyWebhookSignature(body, signature))) {
      // An invalid signature is an unauthenticated caller, not an incident. It was
      // reported to PostHog, which let anyone who knows the webhook URL fill the
      // error stream (finding 4.7). The server-side log line stays.
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    const event = JSON.parse(body);
    const eventType = event.event;
    const payload = event.payload;

    // An event id is mandatory. It is the only thing to dedupe on, so without
    // one a redelivery would re-run the event. The old `event.id || payload?.id`
    // fallback never fired: the payload object has no `id` field, so the
    // expression was always just `event.id` (finding 4.5).
    if (!eventType || typeof eventType !== "string" || typeof event.id !== "string" || event.id.length === 0) {
      console.error("[Webhook] Event is missing an id or type, refusing to process");
      return new Response(
        JSON.stringify({ error: "Malformed event" }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    const eventId = event.id;

    // Claim before dispatching. This replaces a read-then-write check: two
    // concurrent deliveries of the same event could both read "not seen" and
    // then both extend the subscription, so the previous guard only stopped
    // sequential replays (finding 4.4).
    if (!(await claimWebhookEvent(eventId, eventType))) {
      return new Response(
        JSON.stringify({ received: true }),
        { status: 200, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    console.log(`[Webhook] Received event: ${eventType} (ID: ${eventId})`);

    // The claim is held across the dispatch, so on failure it has to be released -
    // otherwise an event whose handler crashed would be permanently unprocessable,
    // because every Razorpay retry would look like a duplicate.
    try {
      switch (eventType) {
        case "subscription.activated":
          await handleSubscriptionActivated(payload);
          break;
        case "subscription.charged":
          await handleSubscriptionCharged(payload, eventId);
          break;
        case "subscription.cancelled":
          await handleSubscriptionCancelled(payload);
          break;
        case "subscription.completed":
          await handleSubscriptionCompleted(payload);
          break;
        case "payment.failed":
          await handlePaymentFailed(payload, eventId);
          break;
        default:
          console.log(`[Webhook] Unhandled event type: ${eventType}`);
          await captureServerException(
            "razorpay-webhook",
            new Error(`Unhandled Razorpay webhook event type: ${eventType}`),
            { source: "razorpay-webhook", event_type: eventType }
          );
      }
    } catch (dispatchError) {
      await releaseWebhookEvent(eventId);
      throw dispatchError;
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[Webhook] Error:", error);
    await captureServerException("razorpay-webhook", error, {
      source: "razorpay-webhook",
      stage: "unhandled",
    });
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
    );
  }
});
