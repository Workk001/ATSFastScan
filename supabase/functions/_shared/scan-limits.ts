// Scan limit utilities for enforcing plan-based usage limits

import { getOrCreateUser, updateUser, UserRecord } from "./external-supabase.ts";

// Plan limits (must match frontend pricing.ts)
const PLAN_LIMITS = {
  free: { resumeScans: 2, coverLetterScans: 0 },
  plus: { resumeScans: 10, coverLetterScans: 5 },
  pro: { resumeScans: Infinity, coverLetterScans: Infinity },
} as const;

export type ScanType = 'resume' | 'cover_letter';

export interface ScanLimitResult {
  allowed: boolean;
  used: number;
  limit: number | null; // null = unlimited
  remaining: number | null; // null = unlimited
  planType: 'free' | 'plus' | 'pro';
  requiresUpgrade?: boolean;
  upgradeMessage?: string;
}

// Check if monthly counters need reset
async function checkAndResetMonthlyCounters(user: UserRecord): Promise<UserRecord> {
  const resetDate = new Date(user.month_reset_date);
  const now = new Date();

  if (now >= resetDate) {
    // Reset counters and set next reset date
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    console.log(`[ScanLimits] Resetting monthly counters for user ${user.firebase_uid}`);
    
    const updatedUser = await updateUser(user.firebase_uid, {
      resume_scans_used_this_month: 0,
      cover_letter_scans_used_this_month: 0,
      month_reset_date: nextMonth.toISOString(),
    });
    
    return updatedUser;
  }

  return user;
}

// Strict access rule:
// - FREE plan features are always accessible
// - PLUS/PRO features are accessible ONLY when subscription_status === 'active'
// - Any unknown/pending/trial/cancelled state is treated as FREE for entitlements
function isEntitledToPaidPlan(user: UserRecord): boolean {
  if (user.plan_type === 'free') return false;

  if (user.subscription_status !== 'active') return false;

  // If an end date exists, ensure it's not expired
  if (user.subscription_end_date) {
    const endDate = new Date(user.subscription_end_date);
    return new Date() <= endDate;
  }

  // Active without end date: treat as active (webhook-driven systems may omit end date)
  return true;
}

// Get effective plan (downgrade to free if subscription expired)
function getEffectivePlan(user: UserRecord): 'free' | 'plus' | 'pro' {
  if (user.plan_type === 'free') return 'free';
  return isEntitledToPaidPlan(user) ? user.plan_type : 'free';
}

// Check scan limit for a user and atomically increment it if allowed
export async function checkScanLimit(
  firebaseUid: string,
  email: string,
  scanType: ScanType
): Promise<ScanLimitResult> {
  // Get or create user
  let user = await getOrCreateUser(firebaseUid, email);
  
  // Check and reset monthly counters if needed
  user = await checkAndResetMonthlyCounters(user);
  
  // Get effective plan (handles expired subscriptions)
  const effectivePlan = getEffectivePlan(user);
  const limits = PLAN_LIMITS[effectivePlan];
  
  // Determine limit based on scan type
  const limit = scanType === 'resume' ? limits.resumeScans : limits.coverLetterScans;
  
  // Check if cover letter access is blocked for free users
  if (scanType === 'cover_letter' && effectivePlan === 'free') {
    return {
      allowed: false,
      used: 0,
      limit: 0,
      remaining: 0,
      planType: effectivePlan,
      requiresUpgrade: true,
      upgradeMessage: 'Cover letter analysis requires a Plus or Pro subscription.',
    };
  }
  
  // Determine parameter for the RPC limit
  const rpcLimit = limit === Infinity ? 999999 : limit;
  
  const { getExternalSupabaseClient } = await import("./external-supabase.ts");
  const supabase = getExternalSupabaseClient();
  
  // Atomically check and increment
  const { data: allowed, error } = await supabase
    .rpc('increment_scan_count', {
      p_firebase_uid: firebaseUid,
      p_scan_type: scanType,
      p_limit: rpcLimit
    });
    
  if (error || !allowed) {
    if (error) {
      console.error("[ScanLimits] RPC error incrementing scan count:", error);
    }
    const currentUsed = scanType === 'resume' 
      ? user.resume_scans_used_this_month 
      : user.cover_letter_scans_used_this_month;
    return {
      allowed: false,
      used: Math.max(currentUsed, rpcLimit),
      limit: limit === Infinity ? null : limit,
      remaining: 0,
      planType: effectivePlan,
      requiresUpgrade: true,
      upgradeMessage: `You've used all ${limit === Infinity ? 'unlimited' : limit} ${scanType === 'resume' ? 'resume' : 'cover letter'} scans this month. Upgrade for more!`,
    };
  }
  
  // Success: it has been atomically incremented in the DB
  const currentUsed = scanType === 'resume'
    ? user.resume_scans_used_this_month
    : user.cover_letter_scans_used_this_month;
  const newUsed = currentUsed + 1;
  
  return {
    allowed: true,
    used: newUsed,
    limit: limit === Infinity ? null : limit,
    remaining: limit === Infinity ? null : Math.max(0, limit - newUsed),
    planType: effectivePlan,
  };
}

// Get user subscription info for response
export async function getUserSubscriptionInfo(
  firebaseUid: string,
  email: string
): Promise<{
  plan: 'free' | 'plus' | 'pro';
  status: 'active' | 'cancelled' | 'trial' | null;
  resumeScansUsed: number;
  resumeScansLimit: number | null;
  coverLetterScansUsed: number;
  coverLetterScansLimit: number | null;
  resetDate: string;
  cancelAtPeriodEnd?: boolean;
  subscriptionEndDate?: string | null;
}> {
  let user = await getOrCreateUser(firebaseUid, email);
  user = await checkAndResetMonthlyCounters(user);
  
  const effectivePlan = getEffectivePlan(user);
  const limits = PLAN_LIMITS[effectivePlan];

  // Detect if user cancelled but still has remaining paid access
  const cancelAtPeriodEnd = !!(user.cancelled_at && effectivePlan !== 'free' && user.subscription_end_date);
  
  return {
    plan: effectivePlan,
    status: user.subscription_status,
    resumeScansUsed: user.resume_scans_used_this_month,
    resumeScansLimit: limits.resumeScans === Infinity ? null : limits.resumeScans,
    coverLetterScansUsed: user.cover_letter_scans_used_this_month,
    coverLetterScansLimit: limits.coverLetterScans === Infinity ? null : limits.coverLetterScans,
    resetDate: user.month_reset_date,
    cancelAtPeriodEnd,
    subscriptionEndDate: user.subscription_end_date,
  };
}
