// External Supabase client for user/subscription management
// Uses service role key for full database access

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

export interface UserRecord {
  id: string; // UUID primary key
  firebase_uid: string; // Firebase UID for lookups
  email: string;
  name: string | null;
  plan_type: 'free' | 'plus' | 'pro';
  subscription_status: 'active' | 'cancelled' | 'trial' | null;
  resume_scans_used_this_month: number;
  cover_letter_scans_used_this_month: number;
  month_reset_date: string;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  trial_ends_at: string | null;
  cancelled_at: string | null;
  razorpay_customer_id: string | null;
  razorpay_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionHistory {
  id: string;
  user_id: string;
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  plan_type: 'plus' | 'pro';
  amount: number;
  status: 'success' | 'failed' | 'refunded';
  created_at: string;
}

let externalClient: SupabaseClient | null = null;

export function getExternalSupabaseClient(): SupabaseClient {
  if (externalClient) return externalClient;

  // Use external keys if configured, otherwise fallback to the hosting project's own service role client
  const url = Deno.env.get("EXTERNAL_SUPABASE_URL") || Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("EXTERNAL_SUPABASE_SERVICE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceKey) {
    throw new Error("Supabase credentials not configured");
  }

  externalClient = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return externalClient;
}

// Get or create user by Firebase UID
export async function getOrCreateUser(
  firebaseUid: string, 
  email: string,
  name?: string
): Promise<UserRecord> {
  const supabase = getExternalSupabaseClient();

  // Step 1: Try to find existing user by firebase_uid
  const { data: existingUser, error: selectError } = await supabase
    .from('users')
    .select('*')
    .eq('firebase_uid', firebaseUid)
    .maybeSingle();

  if (existingUser) return existingUser as UserRecord;

  // Step 2: Try to find by email (Firebase migration case)
  const { data: userByEmail } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (userByEmail) {
    // Rebind the existing row to the Firebase UID presenting this email.
    //
    // The update's error used to be discarded and the resulting (null) data cast
    // straight to UserRecord, so any failure - most commonly a unique violation
    // on firebase_uid, or a row deleted between the read and the write - handed
    // the caller an object with no id and the callers then persisted against
    // `undefined`. Check the outcome properly: on failure, log and fall through to
    // step 3 rather than returning a phantom user.
    const { data: updated, error: updateError } = await supabase
      .from('users')
      .update({ firebase_uid: firebaseUid })
      .eq('id', userByEmail.id)
      .select()
      .single();

    if (!updateError && updated) return updated as UserRecord;

    // Suppressed on purpose is not the case here - the detail matters for
    // diagnosing a rebind that keeps failing for one account.
    console.error(
      "[ExternalDB] Failed to rebind firebase_uid on existing email row:",
      updateError
        ? (updateError.code ?? "") + " " + updateError.message
        : "update returned no row",
    );
  }

  // Step 3: Create new user
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({
      firebase_uid: firebaseUid,
      email: email,
      name: name || null,
      plan_type: 'free',
      subscription_status: null,
      resume_scans_used_this_month: 0,
      cover_letter_scans_used_this_month: 0,
      month_reset_date: nextMonth.toISOString(),
      subscription_start_date: null,
      subscription_end_date: null,
      trial_ends_at: null,
      cancelled_at: null,
      razorpay_customer_id: null,
      razorpay_subscription_id: null,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    })
    .select()
    .single();

  if (insertError) {
    // Handle race condition - another request created the user
    if (insertError.code === '23505') {
      const { data: racedUser } = await supabase
        .from('users')
        .select('*')
        .eq('firebase_uid', firebaseUid)
        .single();
      if (racedUser) return racedUser as UserRecord;
    }
    console.error("[ExternalDB] Failed to create user:", insertError);
    throw new Error('Failed to create user record');
  }

  return newUser as UserRecord;
}

// Get user by Firebase UID
export async function getUserById(firebaseUid: string): Promise<UserRecord | null> {
  const client = getExternalSupabaseClient();
  
  const { data, error } = await client
    .from("users")
    .select("*")
    .eq("firebase_uid", firebaseUid)
    .single();

  if (error || !data) {
    return null;
  }

  return data as UserRecord;
}

// Update user fields by Firebase UID
export async function updateUser(
  firebaseUid: string,
  updates: Partial<Omit<UserRecord, 'id' | 'firebase_uid' | 'created_at'>>
): Promise<UserRecord> {
  const client = getExternalSupabaseClient();
  
  const { data, error } = await client
    .from("users")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("firebase_uid", firebaseUid)
    .select()
    .single();

  if (error) {
    console.error("[ExternalDB] Failed to update user:", error);
    throw new Error("Failed to update user record");
  }

  return data as UserRecord;
}

// Log subscription payment (requires internal UUID user_id)
export async function logSubscriptionPayment(
  firebaseUid: string,
  razorpayPaymentId: string,
  razorpaySubscriptionId: string,
  planType: 'plus' | 'pro',
  amountPaise: number,
  status: 'success' | 'failed' | 'refunded',
  razorpayEventId?: string
): Promise<void> {
  const client = getExternalSupabaseClient();
  
  // First get the user's internal UUID
  const user = await getUserById(firebaseUid);
  if (!user) {
    console.error("[ExternalDB] Cannot log payment: user not found", firebaseUid);
    return;
  }
  
  const { error } = await client.from("subscription_history").insert({
    user_id: user.id, // Use internal UUID for FK
    razorpay_payment_id: razorpayPaymentId,
    razorpay_subscription_id: razorpaySubscriptionId,
    razorpay_event_id: razorpayEventId,
    plan_type: planType,
    amount: amountPaise,
    status,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("[ExternalDB] Failed to log payment:", error);
  }
}
