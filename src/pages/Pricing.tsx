import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Crown, User, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { UpgradeButton } from '@/components/UpgradeButton';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

import {
  PLAN_FEATURES,
  PLAN_DISPLAY_PRICING,
  getPlanDisplayName,
  getAnnualSavings,
  type PlanType,
} from '@/lib/pricing';

const Pricing = () => {
  const { user } = useAuth();
  const { plan: currentPlan } = useSubscription();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans: {
    type: PlanType;
    icon: typeof User;
    iconColor: string;
    gradientFrom: string;
    gradientTo: string;
    popular?: boolean;
  }[] = [
    { 
      type: 'free', 
      icon: User, 
      iconColor: 'text-muted-foreground',
      gradientFrom: 'from-slate-500/20',
      gradientTo: 'to-slate-600/10',
    },
    { 
      type: 'plus', 
      icon: Zap, 
      iconColor: 'text-primary',
      gradientFrom: 'from-primary/20',
      gradientTo: 'to-accent/10',
      popular: true,
    },
    { 
      type: 'pro', 
      icon: Crown, 
      iconColor: 'text-amber-500',
      gradientFrom: 'from-amber-500/20',
      gradientTo: 'to-orange-500/10',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <Helmet>
        <title>Pricing – Free & Paid ATS Checker Plans | ATS FastScan</title>
        <meta name="description" content="Free: 2 lifetime resume scans. Plus: ₹299/month for 10 resume + 5 cover letter scans. Pro: ₹599/month unlimited scans." />
        <link rel="canonical" href="https://www.atsfastscan.com/pricing" />
      </Helmet>
      {/* Premium Background Effects */}
      
      

      <main className="flex-1 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Back link */}
          <Link 
            to={user ? '/dashboard' : '/'} 
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground mb-8 sm:mb-10 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
            {user ? 'Back to Dashboard' : 'Back to Home'}
          </Link>

          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <Badge 
              variant="outline" 
              className="mb-4 sm:mb-6 bg-primary/5 border-primary/20 text-primary px-3 py-1 text-xs sm:text-sm"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />
              Simple Pricing
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
                Perfect Plan
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10">
              Unlock the full potential of your job search with our premium features.
              No hidden fees, cancel anytime.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3 sm:gap-4 bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-full px-4 sm:px-6 py-2 sm:py-3">
              <span className={`text-xs sm:text-sm font-medium transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-primary"
              />
              <span className={`text-xs sm:text-sm font-medium transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annual
              </span>
              {isAnnual && (
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[0.65rem] sm:text-xs font-semibold">
                  Save 20%
                </Badge>
              )}
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3 lg:gap-6 xl:gap-8">
            {plans.map(({ type, icon: Icon, iconColor, gradientFrom, gradientTo, popular }, index) => {
              const price = type === 'free' 
                ? 0 
                : isAnnual 
                  ? PLAN_DISPLAY_PRICING[type].annual 
                  : PLAN_DISPLAY_PRICING[type].monthly;
              const isCurrentPlan = currentPlan === type;
              const features = PLAN_FEATURES[type];
              const savings = type !== 'free' && isAnnual ? getAnnualSavings(type) : 0;

              return (
                <Card
                  key={type}
                  className={`relative flex flex-col backdrop-blur-sm transition-all duration-500 hover:translate-y-[-4px] animate-fade-in-up group ${
                    popular 
                      ? 'border-primary/50 bg-gradient-to-b from-primary/5 to-background shadow-2xl shadow-primary/10 lg:scale-105 lg:z-10' 
                      : 'border-border/50 bg-card/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5'
                  } ${isCurrentPlan ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {popular && (
                    <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 sm:px-4 py-1 text-[0.65rem] sm:text-xs font-semibold shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="relative text-center pb-4 sm:pb-6 pt-6 sm:pt-8">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 sm:mb-5 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                      type === 'pro' 
                        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 shadow-lg' 
                        : type === 'plus'
                          ? 'bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 shadow-lg'
                          : 'bg-secondary/80 border border-border'
                    }`}>
                      <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${iconColor}`} />
                    </div>
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold">{getPlanDisplayName(type)}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1">
                      {type === 'free' && 'Get started for free'}
                      {type === 'plus' && 'For active job seekers'}
                      {type === 'pro' && 'For power users'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative flex-1 flex flex-col px-5 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                    {/* Price */}
                    <div className="text-center mb-6 sm:mb-8">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${type === 'pro' ? 'bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent' : type === 'plus' ? 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent' : 'text-foreground'}`}>
                          {price === 0 ? 'Free' : `₹${price}`}
                        </span>
                        {price > 0 && (
                          <span className="text-sm sm:text-base text-muted-foreground">/mo</span>
                        )}
                      </div>
                      {isAnnual && savings > 0 && (
                        <p className="text-xs sm:text-sm text-green-400 mt-2 font-medium">
                          Save ₹{savings.toLocaleString('en-IN')}/year
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            type === 'pro' 
                              ? 'bg-amber-500/20 text-amber-400' 
                              : type === 'plus'
                                ? 'bg-primary/20 text-primary'
                                : 'bg-green-500/20 text-green-400'
                          }`}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-auto">
                      {isCurrentPlan ? (
                        <Button 
                          variant="outline" 
                          className="w-full h-10 sm:h-12 text-xs sm:text-sm font-medium" 
                          disabled
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Current Plan
                        </Button>
                      ) : type === 'free' ? (
                        user ? (
                          <Button 
                            variant="outline" 
                            className="w-full h-10 sm:h-12 text-xs sm:text-sm font-medium" 
                            disabled
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Current Plan
                          </Button>
                        ) : (
                          <Link to="/signup" className="block">
                            <Button 
                              variant="outline" 
                              className="w-full h-10 sm:h-12 text-xs sm:text-sm font-medium hover:bg-secondary/80"
                            >
                              Get Started Free
                            </Button>
                          </Link>
                        )
                      ) : (
                        user ? (
                          <UpgradeButton
                            planType={type}
                            billingCycle={isAnnual ? 'annual' : 'monthly'}
                            price={price}
                            variant={popular ? 'glow' : 'default'}
                            className={`w-full h-10 sm:h-12 text-xs sm:text-sm font-semibold ${
                              type === 'pro' 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-lg' 
                                : ''
                            }`}
                          />
                        ) : (
                          <Link to="/signup" className="block">
                            <Button 
                              variant={popular ? 'glow' : 'default'} 
                              className={`w-full h-10 sm:h-12 text-xs sm:text-sm font-semibold ${
                                type === 'pro' 
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-lg text-white' 
                                  : ''
                              }`}
                            >
                              Start Free Trial
                            </Button>
                          </Link>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Trust indicators */}
          <div className="mt-12 sm:mt-16 text-center animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Secure payment</span>
              </div>
            </div>
          </div>

          {/* FAQ link */}
          <div className="text-center mt-8 sm:mt-10">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Have questions?{' '}
              <Link to="/faq" className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors">
                Check our FAQ
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
