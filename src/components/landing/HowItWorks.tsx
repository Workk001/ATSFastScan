import { Upload, Cpu, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Resume",
    description: "Drag and drop your PDF resume. Quick and easy.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analysis",
    description: "Our AI scans your resume like an ATS would, checking 100+ factors.",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Get Results",
    description: "See your score, missing keywords, and specific improvement tips.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 relative bg-card/30 lazy-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-16 max-w-3xl mx-auto space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/25 text-xs sm:text-sm font-semibold text-primary animate-slide-up-fade">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Simple Process</span>
          </div>
          <h2
            className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-extrabold text-foreground animate-slide-up-fade tracking-tight leading-[1.2]"
            style={{ animationDelay: "0.1s" }}
          >
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground animate-slide-up-fade leading-[1.7] max-w-xl mx-auto" style={{ animationDelay: "0.2s" }}>
            Three simple steps. No complicated setup.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-14 lg:mb-16 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="relative animate-slide-up-fade"
              style={{ animationDelay: `${0.15 + index * 0.1}s` }}
            >
              {/* Connector line - hidden on mobile */}
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute top-12 lg:top-14 left-[60%] w-full">
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                    <ArrowRight className="w-3.5 h-3.5 text-primary/40" />
                  </div>
                </div>
              )}

              <div className="glass-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-5 sm:p-7 lg:p-10 text-center h-full relative overflow-hidden transition-all duration-400 hover:-translate-y-1 sm:hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 lg:w-28 lg:h-28 bg-primary/10 rounded-full blur-3xl -mt-10 lg:-mt-14" />

                <div className="absolute top-3 right-3 lg:top-5 lg:right-5 w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center">
                  <span className="text-xs lg:text-sm font-bold text-primary">{step.step}</span>
                </div>

                <div className="relative w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mx-auto rounded-lg sm:rounded-xl border border-primary/30 bg-primary/15 flex items-center justify-center mb-4 sm:mb-5 transition-transform duration-300 hover:scale-110">
                  <step.icon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-[1.7]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center animate-slide-up-fade" style={{ animationDelay: "0.5s" }}>
          <Link to="/upload">
            <Button
              variant="glow"
              size="lg"
              className="group rounded-xl px-8 sm:px-12 h-12 sm:h-14 text-sm sm:text-base font-extrabold hover:-translate-y-[3px] transition-all duration-300 w-full sm:w-auto"
            >
              Scan My Resume Free
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-xs sm:text-sm text-muted-foreground mt-4">Free • No credit card required • Results in 30 seconds</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
