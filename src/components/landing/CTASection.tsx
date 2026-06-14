import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Check, Zap } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 relative lazy-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-10 lg:p-14 text-center relative overflow-hidden border-primary/15">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-primary/10 rounded-full blur-[80px] sm:blur-[100px] -mt-32 sm:-mt-48" />

            <div className="relative z-10 space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/25 text-xs sm:text-sm font-semibold text-primary animate-slide-up-fade">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Takes less than 30 seconds</span>
              </div>

              <h2
                className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-extrabold text-foreground animate-slide-up-fade tracking-tight leading-[1.2]"
                style={{ animationDelay: "0.1s" }}
              >
                Stop Getting Ghosted by Recruiters
              </h2>

              <p
                className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto leading-[1.7] animate-slide-up-fade"
                style={{ animationDelay: "0.2s" }}
              >
                75% of resumes are rejected before a human sees them. Find out if yours passes — free.
              </p>

              <div
                className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 animate-slide-up-fade"
                style={{ animationDelay: "0.3s" }}
              >
                {["2 Free Scans", "Instant Results", "Privacy Protected"].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="animate-slide-up-fade pt-2 sm:pt-4" style={{ animationDelay: "0.4s" }}>
                <Link to="/upload">
                  <Button
                    variant="glow"
                    size="lg"
                    className="group rounded-xl px-8 sm:px-12 h-12 sm:h-14 text-sm sm:text-base font-extrabold hover:-translate-y-[3px] transition-all duration-300 w-full sm:w-auto"
                  >
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                    Check My Resume for Free
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
