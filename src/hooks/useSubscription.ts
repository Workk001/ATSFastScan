import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getFirebaseIdToken } from '@/lib/getFirebaseToken';
import { useAuth } from '@/contexts/AuthContext';
import { PLAN_LIMITS, type PlanType } from '@/lib/pricing';

interface SubscriptionInfo {
  plan: PlanType;
  status: 'active' | 'cancelled' | 'trial' | null;
  resumeScansUsed: number;
  resumeScansLimit: number | null;
  coverLetterScansUsed: number;
  coverLetterScansLimit: number | null;
  resetDate: string;
}

interface UseSubscriptionReturn {
  // State
  plan: PlanType;
  status: 'active' | 'cancelled' | 'trial' | null;
  isLoading: boolean;
  error: string | null;
  
  // Usage counts
  resumeScansUsed: number;
  resumeScansRemaining: number | null;
  coverLetterScansUsed: number;
  coverLetterScansRemaining: number | null;
  
  // Limits
  resumeScansLimit: number | null;
  coverLetterScansLimit: number | null;
  
  // Reset date
  resetDate: Date | null;
  
  // Helper functions
  canScanResume: () => boolean;
  canScanCoverLetter: () => boolean;
  isUnlimited: () => boolean;
  refreshSubscription: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const authToken = await getFirebaseIdToken();
      if (!authToken) {
        throw new Error('Not authenticated');
      }

      const { data, error: fnError } = await supabase.functions.invoke('subscription/status', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      setSubscription(data as SubscriptionInfo);
    } catch (err) {
      console.error('[useSubscription] Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
      // Default to free plan on error
      setSubscription({
        plan: 'free',
        status: null,
        resumeScansUsed: 0,
        resumeScansLimit: PLAN_LIMITS.free.resumeScans,
        coverLetterScansUsed: 0,
        coverLetterScansLimit: PLAN_LIMITS.free.coverLetterScans,
        resetDate: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Computed values with defaults
  // Note: null means unlimited (Pro plan), undefined means no data yet
  const plan = subscription?.plan ?? 'free';
  const status = subscription?.status ?? null;
  const resumeScansUsed = subscription?.resumeScansUsed ?? 0;
  // Preserve null for unlimited - only default to free limits when subscription is undefined
  const resumeScansLimit = subscription ? subscription.resumeScansLimit : PLAN_LIMITS.free.resumeScans;
  const coverLetterScansUsed = subscription?.coverLetterScansUsed ?? 0;
  const coverLetterScansLimit = subscription ? subscription.coverLetterScansLimit : PLAN_LIMITS.free.coverLetterScans;

  // Calculate remaining
  const resumeScansRemaining = resumeScansLimit === null 
    ? null 
    : Math.max(0, resumeScansLimit - resumeScansUsed);
  
  const coverLetterScansRemaining = coverLetterScansLimit === null 
    ? null 
    : Math.max(0, coverLetterScansLimit - coverLetterScansUsed);

  // Reset date
  const resetDate = subscription?.resetDate ? new Date(subscription.resetDate) : null;

  // Helper functions
  const canScanResume = useCallback(() => {
    // Resume scanning is always allowed within the effective limits.
    // Only PRO gets unlimited, and only when status is active.
    if (plan === 'pro' && status === 'active') return true;
    return resumeScansRemaining === null || resumeScansRemaining > 0;
  }, [plan, status, resumeScansRemaining]);

  const canScanCoverLetter = useCallback(() => {
    // Strict access rule: paid features only when status === 'active'.
    if (status !== 'active') return false;
    if (plan === 'free') return false;
    if (plan === 'pro') return true;
    return coverLetterScansRemaining === null || coverLetterScansRemaining > 0;
  }, [plan, status, coverLetterScansRemaining]);

  const isUnlimited = useCallback(() => {
    return plan === 'pro' && status === 'active';
  }, [plan, status]);

  return {
    plan,
    status,
    isLoading,
    error,
    resumeScansUsed,
    resumeScansRemaining,
    coverLetterScansUsed,
    coverLetterScansRemaining,
    resumeScansLimit,
    coverLetterScansLimit,
    resetDate,
    canScanResume,
    canScanCoverLetter,
    isUnlimited,
    refreshSubscription: fetchSubscription,
  };
}
