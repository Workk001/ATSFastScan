// Plan types
export type PlanType = 'free' | 'plus' | 'pro';
export type BillingCycle = 'monthly' | 'annual';
export type SubscriptionStatus = 'active' | 'cancelled' | 'trial' | null;

// Plan limits configuration
export const PLAN_LIMITS = {
  free: {
    resumeScans: 2,
    coverLetterScans: 0,
  },
  plus: {
    resumeScans: 10,
    coverLetterScans: 5,
  },
  pro: {
    resumeScans: Infinity,
    coverLetterScans: Infinity,
  },
} as const;

// Pricing in INR (paise for Razorpay)
export const PLAN_PRICING = {
  plus: {
    monthly: 29900, // ₹299
    annual: 299900, // ₹2,999 (₹249/month)
  },
  pro: {
    monthly: 99900, // ₹999
    annual: 958800, // ₹9,588 (₹799/month)
  },
} as const;

// Display pricing in rupees
export const PLAN_DISPLAY_PRICING = {
  free: { monthly: 0, annual: 0 },
  plus: { monthly: 299, annual: 249 },
  pro: { monthly: 999, annual: 799 },
} as const;

// Feature lists for pricing page
export const PLAN_FEATURES = {
  free: [
    '2 resume scans/month',
    'Basic ATS analysis',
    'Keyword matching',
    'Formatting check',
  ],
  plus: [
    '10 resume scans/month',
    '5 cover letter scans/month',
    'Full ATS analysis',
    'Job description matching',
    'LinkedIn optimization tips',
    'Priority support',
  ],
  pro: [
    'Unlimited resume scans',
    'Unlimited cover letter scans',
    'Full ATS analysis',
    'Job description matching',
    'LinkedIn optimization tips',
    'Priority support',
    'Advanced role detection',
    'Score history tracking',
  ],
} as const;

// Helper functions
export function getPlanDisplayName(plan: PlanType): string {
  const names: Record<PlanType, string> = {
    free: 'Free',
    plus: 'Plus',
    pro: 'Pro',
  };
  return names[plan];
}

export function formatPrice(priceInRupees: number): string {
  if (priceInRupees === 0) return 'Free';
  return `₹${priceInRupees.toLocaleString('en-IN')}`;
}

export function canUseCoverLetter(plan: PlanType): boolean {
  return plan !== 'free';
}

export function getResumeLimit(plan: PlanType): number | null {
  const limit = PLAN_LIMITS[plan].resumeScans;
  return limit === Infinity ? null : limit;
}

export function getCoverLetterLimit(plan: PlanType): number | null {
  const limit = PLAN_LIMITS[plan].coverLetterScans;
  return limit === Infinity ? null : limit;
}

export function isUnlimited(plan: PlanType): boolean {
  return plan === 'pro';
}

export function getAnnualSavings(plan: 'plus' | 'pro'): number {
  const monthlyTotal = PLAN_DISPLAY_PRICING[plan].monthly * 12;
  const annualTotal = PLAN_DISPLAY_PRICING[plan].annual * 12;
  return monthlyTotal - annualTotal;
}

// Deprecated - trials removed
export function getTrialDays(): number {
  return 0;
}
