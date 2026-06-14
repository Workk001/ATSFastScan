import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap, Crown, ArrowRight } from 'lucide-react';
import type { PlanType } from '@/lib/pricing';
import { PLAN_DISPLAY_PRICING, getPlanDisplayName } from '@/lib/pricing';

interface ScanLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scanType: 'resume' | 'cover_letter';
  currentPlan: PlanType;
  used: number;
  limit: number;
}

export function ScanLimitModal({
  open,
  onOpenChange,
  scanType,
  currentPlan,
  used,
  limit,
}: ScanLimitModalProps) {
  const isFreePlanCoverLetter = currentPlan === 'free' && scanType === 'cover_letter';
  
  const title = isFreePlanCoverLetter
    ? 'Upgrade to Analyze Cover Letters'
    : `Monthly ${scanType === 'resume' ? 'Resume' : 'Cover Letter'} Limit Reached`;

  const description = isFreePlanCoverLetter
    ? 'Cover letter analysis is available on Plus and Pro plans.'
    : `You've used all ${limit} ${scanType === 'resume' ? 'resume' : 'cover letter'} scans this month.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current plan */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Current Plan:</span>
              <span className="font-semibold text-foreground">{getPlanDisplayName(currentPlan)}</span>
            </div>
            {!isFreePlanCoverLetter && (
              <span className="text-sm text-destructive font-medium">{used}/{limit} used</span>
            )}
          </div>

          {/* Upgrade options */}
          <div className="space-y-3">
            {currentPlan !== 'plus' && (
              <Link to="/pricing" onClick={() => onOpenChange(false)}>
                <div className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Plus Plan</p>
                      <p className="text-sm text-muted-foreground">
                        10 resume + 5 cover letter scans/mo
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">₹{PLAN_DISPLAY_PRICING.plus.monthly}</p>
                    <p className="text-xs text-muted-foreground">/month</p>
                  </div>
                </div>
              </Link>
            )}

            {currentPlan !== 'pro' && (
              <Link to="/pricing" onClick={() => onOpenChange(false)}>
                <div className="flex items-center justify-between p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Pro Plan</p>
                      <p className="text-sm text-muted-foreground">
                        Unlimited scans
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-500">₹{PLAN_DISPLAY_PRICING.pro.monthly}</p>
                    <p className="text-xs text-muted-foreground">/month</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link to="/pricing" onClick={() => onOpenChange(false)}>
            <Button className="w-full gap-2" size="lg">
              View All Plans
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
