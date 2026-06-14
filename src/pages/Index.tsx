import { lazy, Suspense } from "react";
import HeroSection from "@/components/landing/HeroSection";
import TrustSection from "@/components/landing/TrustSection";

const HowItWorks = lazy(() => import("@/components/landing/HowItWorks"));
const ATSEducationSection = lazy(() => import("@/components/landing/ATSEducationSection"));
const FeaturesGrid = lazy(() => import("@/components/landing/FeaturesGrid"));
const TestimonialsSection = lazy(() => import("@/components/landing/TestimonialsSection"));
const FAQSection = lazy(() => import("@/components/landing/FAQSection"));
const CTASection = lazy(() => import("@/components/landing/CTASection"));
const Footer = lazy(() => import("@/components/Footer"));
const ExitIntentBanner = lazy(() => import("@/components/landing/ExitIntentBanner"));
const FloatingCTA = lazy(() => import("@/components/landing/FloatingCTA"));
const MobileExitIntent = lazy(() => import("@/components/landing/MobileExitIntent"));
const KeywordCheckerWidget = lazy(() => import("@/components/landing/KeywordCheckerWidget"));

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Above the fold: Hero + Trust — fast to scan, single CTA */}
        <HeroSection />
        <TrustSection />

        {/* How it works — immediately answers "what do I do?" */}
        <div className="section-divider" />
        <Suspense fallback={null}>
          <HowItWorks />
        </Suspense>

        {/* Social proof — builds trust before asking for action */}
        <div className="section-divider" />
        <Suspense fallback={null}>
          <TestimonialsSection />
        </Suspense>

        {/* Education — for users who need convincing */}
        <div className="section-divider" />
        <Suspense fallback={null}>
          <ATSEducationSection />
        </Suspense>

        {/* Features */}
        <div className="section-divider" />
        <Suspense fallback={null}>
          <FeaturesGrid />
        </Suspense>

        {/* Keyword checker — engagement tool, not primary CTA */}
        <Suspense fallback={null}>
          <section className="py-10 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-xs text-muted-foreground font-medium tracking-wide uppercase">Quick Keyword Preview</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <KeywordCheckerWidget />
            </div>
          </section>
        </Suspense>

        {/* FAQ */}
        <div className="section-divider" />
        <Suspense fallback={null}>
          <FAQSection />
        </Suspense>

        {/* Final CTA */}
        <div className="section-divider" />
        <Suspense fallback={null}>
          <CTASection />
        </Suspense>

        {/* Engagement tools */}
        <Suspense fallback={null}>
          <ExitIntentBanner />
        </Suspense>
        <Suspense fallback={null}>
          <FloatingCTA />
        </Suspense>
        <Suspense fallback={null}>
          <MobileExitIntent />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
