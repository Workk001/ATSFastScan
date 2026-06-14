import { Link } from 'react-router-dom';
import { FileText, Mail, ArrowRight, Calendar, Loader2, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanBadge } from '@/components/PlanBadge';
import { UsageBar } from '@/components/UsageBar';
import { UpgradeButton } from '@/components/UpgradeButton';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { getPlanDisplayName, PLAN_DISPLAY_PRICING } from '@/lib/pricing';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    plan,
    status,
    isLoading,
    resumeScansUsed,
    resumeScansLimit,
    coverLetterScansUsed,
    coverLetterScansLimit,
    resetDate,
    isUnlimited,
  } = useSubscription();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const showUpgrade = plan !== 'pro';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-20 pb-10 sm:pt-24 sm:pb-12 lg:pt-28 lg:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                  Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </p>
                {user?.email && (
                  <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                )}
              </div>
              <PlanBadge plan={plan} showLink={false} size="md" />
            </div>
          </div>

          {/* Plan Card */}
          <Card className="mb-5 sm:mb-6 lg:mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
                    {plan === 'pro' && <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />}
                    {plan === 'plus' && <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
                    {getPlanDisplayName(plan)} Plan
                  </CardTitle>
                  <CardDescription className="mt-0.5 sm:mt-1 text-xs sm:text-sm">
                    {plan === 'free' && 'Free forever'}
                    {plan !== 'free' && status === 'active' && 'Active subscription'}
                    {plan !== 'free' && status === 'cancelled' && 'Cancelled - access until period end'}
                  </CardDescription>
                </div>
                {showUpgrade && (
                  <UpgradeButton
                    planType={plan === 'free' ? 'plus' : 'pro'}
                    billingCycle="monthly"
                    price={plan === 'free' ? PLAN_DISPLAY_PRICING.plus.monthly : PLAN_DISPLAY_PRICING.pro.monthly}
                    variant="glow"
                    size="sm"
                    className="text-xs sm:text-sm h-8 sm:h-9"
                  >
                    Upgrade
                  </UpgradeButton>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5 px-4 sm:px-6 pb-4 sm:pb-6">
              {/* Usage bars - show correct limits based on plan */}
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                <UsageBar
                  label="Resume Scans"
                  used={resumeScansUsed}
                  limit={resumeScansLimit}
                />
                {/* Only show cover letter bar for paid plans */}
                {plan !== 'free' ? (
                  <UsageBar
                    label="Cover Letter Scans"
                    used={coverLetterScansUsed}
                    limit={coverLetterScansLimit}
                  />
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Cover Letter Scans</span>
                      <span className="text-muted-foreground text-xs">Plus+ feature</span>
                    </div>
                    <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                      <div className="h-full w-0 rounded-full bg-muted" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upgrade to Plus or Pro to unlock
                    </p>
                  </div>
                )}
              </div>

              {/* Reset date - only show for non-unlimited plans */}
              {resetDate && !isUnlimited() && (
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground pt-2 border-t border-border/50">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Usage resets on {format(resetDate, 'MMMM d, yyyy')}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <Link to="/upload">
              <Card className="h-full hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group">
                <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground mb-0.5 sm:mb-1">Analyze Resume</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      Get ATS score and improvement tips
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </CardContent>
              </Card>
            </Link>

            <Link to="/cover-letter">
              <Card className={`h-full transition-all cursor-pointer group ${
                plan === 'free' 
                  ? 'opacity-75 hover:opacity-100' 
                  : 'hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5'
              }`}>
                <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground mb-0.5 sm:mb-1">
                      Analyze Cover Letter
                      {plan === 'free' && (
                        <span className="ml-1.5 sm:ml-2 text-[0.65rem] sm:text-xs text-amber-500 font-medium">Plus+</span>
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {plan === 'free' 
                        ? 'Upgrade to unlock this feature'
                        : 'Get feedback on your cover letter'
                      }
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Upgrade CTA for free users */}
          {plan === 'free' && (
            <Card className="mt-5 sm:mt-6 lg:mt-8 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-foreground mb-1.5 sm:mb-2">
                      Unlock More Scans & Cover Letter Analysis
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Upgrade to Plus for 10 resume scans + 5 cover letter scans per month, 
                      or go Pro for unlimited access.
                    </p>
                  </div>
                  <Link to="/pricing">
                    <Button variant="glow" size="default" className="gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm h-9 sm:h-10 px-4 sm:px-6">
                      View Plans
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
