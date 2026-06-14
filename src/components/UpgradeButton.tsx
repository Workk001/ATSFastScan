import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Zap, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getFirebaseIdToken } from '@/lib/getFirebaseToken';
import { useAuth } from '@/contexts/AuthContext';
import type { PlanType, BillingCycle } from '@/lib/pricing';
import { useAnalytics } from '@/hooks/usePostHog';
import { useSubscription } from '@/hooks/useSubscription';

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  subscription_id: string;
  name: string;
  description: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    email?: string;
    name?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    confirm_close?: boolean;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayErrorEvent {
  error?: {
    code?: string | number;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: Record<string, unknown>;
  };
}

interface RazorpayInstance {
  open: () => void;
  on?: (event: string, handler: (response: unknown) => void) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

interface UpgradeButtonProps {
  planType: 'plus' | 'pro';
  billingCycle: BillingCycle;
  price: number;
  className?: string;
  variant?: 'default' | 'outline' | 'glow';
  size?: 'default' | 'sm' | 'lg';
  children?: React.ReactNode;
}

export function UpgradeButton({
  planType,
  billingCycle,
  price,
  className = '',
  variant = 'default',
  size = 'default',
  children,
}: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { capture } = useAnalytics();
  const { plan: fromPlan } = useSubscription();

  const userEmail = useMemo(() => user?.email ?? undefined, [user?.email]);
  const userName = useMemo(() => user?.displayName ?? undefined, [user?.displayName]);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    capture("upgrade_clicked", {
      from_plan: fromPlan,
      to_plan: planType,
      billing_cycle: billingCycle,
      price: price,
    });

    try {
      // Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Get auth token
      const authToken = await getFirebaseIdToken();
      if (!authToken) {
        throw new Error('Please sign in to upgrade');
      }

      // Create subscription
      const { data, error } = await supabase.functions.invoke('subscription/create-subscription', {
        body: { planType, billingCycle, email: userEmail, name: userName },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.subscriptionId) {
        throw new Error('Failed to create subscription');
      }

      // Use embedded Razorpay Checkout popup (primary method)
      // Note: Hosted checkout pages (short_url) require explicit enablement in Razorpay dashboard
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Payment configuration missing');
      }

      // Open Razorpay checkout (less reliable for subscriptions, but works for some cases)
      const resolvedEmail = data?.email || userEmail;

      const options: RazorpayOptions = {
        key: razorpayKey,
        subscription_id: data.subscriptionId,
        name: 'ATS FastScan',
        description: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan - ${billingCycle}`,
        prefill: {
          email: resolvedEmail,
          name: userName,
        },
        modal: {
          ondismiss: () => {
            toast({
              title: 'Payment cancelled',
              description: 'No charges were made. Your plan remains Free.',
            });
          },
          escape: true,
          confirm_close: true,
        },
        handler: async (response) => {
          try {
            await supabase.functions.invoke('subscription/verify-payment', {
              body: response,
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });

            capture("upgrade_completed", {
              from_plan: fromPlan,
              to_plan: planType,
              billing_cycle: billingCycle,
              price: price,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
            });

            toast({
              title: 'Payment received',
              description: "We're activating your plan. This usually takes a few seconds.",
            });

            window.location.reload();
          } catch (err) {
            console.error('Payment verification error:', err);
            toast({
              title: 'Payment received',
              description: "We're confirming your payment. If your plan doesn't update in a minute, refresh the page.",
            });
            window.location.reload();
          }
        },
        theme: {
          color: '#2563EB',
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on?.('payment.failed', (evt: unknown) => {
        const err = (evt as RazorpayErrorEvent)?.error;
        const code = err?.code ? String(err.code) : undefined;
        const reason = err?.reason ? String(err.reason) : undefined;
        const description = err?.description ? String(err.description) : undefined;

        console.warn('[Razorpay] payment.failed', { code, reason, description });

        toast({
          title: 'Payment failed',
          description:
            description ||
            reason ||
            (code ? `Payment failed (${code}). Please try again.` : 'Payment could not be completed. Please try again.'),
          variant: 'destructive',
        });
      });

      rzp.open();
    } catch (err) {
      console.error('Upgrade error:', err);
      toast({
        title: 'Upgrade failed',
        description: err instanceof Error ? err.message : 'Failed to start checkout',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = planType === 'pro' ? Crown : Zap;
  const iconColor = planType === 'pro' ? 'text-amber-500' : 'text-primary';

  return (
    <Button
      onClick={handleUpgrade}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={`gap-2 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Icon className={`w-4 h-4 ${iconColor}`} />
      )}
      {children || `Upgrade to ${planType.charAt(0).toUpperCase() + planType.slice(1)}`}
    </Button>
  );
}
