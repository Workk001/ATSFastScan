import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, CheckCircle, FileText, Mail } from "lucide-react";
import HeroFlipCard from "./HeroFlipCard";
import { useSiteStats } from "@/hooks/useSiteStats";

const HeroSection = () => {
  const { data: stats } = useSiteStats();

  const socialProof = stats
    ? [
        { icon: Users, value: stats.totalUsers, label: "users" },
        { icon: FileText, value: stats.totalResumes, label: "resumes scanned" },
        { icon: Mail, value: stats.totalCoverLetters, label: "cover letters scanned" },
      ].filter((item) => item.value > 0)
    : [];

  return (
    <section className="relative min-h-0 pt-20 pb-10 sm:pt-32 sm:pb-20 xl:min-h-[calc(100vh-5rem)] flex items-center overflow-hidden xl:pt-32 xl:pb-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="grid xl:grid-cols-2 gap-8 sm:gap-12 xl:gap-20 2xl:gap-24 items-start max-w-7xl mx-auto">
          {/* Left content */}
          <div className="text-center xl:text-left space-y-4 sm:space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-xs font-semibold text-primary">
              AI-Powered Resume Analysis
            </div>

            {/* Headline — shorter, outcome-driven */}
            <h1 className="text-[1.75rem] leading-[1.15] sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black tracking-[-0.035em] sm:leading-[1.08] text-foreground">
              Is Your Resume Getting
              <br />
              <span className="text-gradient animate-gradient-shimmer">Rejected by ATS?</span>
            </h1>

            {/* Subheadline — one sentence */}
            <p className="text-sm sm:text-lg md:text-xl xl:text-[1.35rem] text-muted-foreground leading-[1.6] max-w-md sm:max-w-lg xl:max-w-xl mx-auto xl:mx-0">
              Upload your resume. Get your ATS score, missing keywords, and exact fixes — in 30 seconds.
            </p>

            {/* Single primary CTA — no competing buttons */}
            <div className="pt-1 sm:pt-2 space-y-3">
              <Link to="/upload" className="block w-full sm:w-auto sm:inline-block">
                <Button
                  variant="glow"
                  size="lg"
                  className="group rounded-xl px-8 sm:px-12 py-4 h-14 sm:h-[3.75rem] text-base sm:text-lg font-extrabold relative overflow-hidden hover:-translate-y-[3px] transition-all duration-300 w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Scan My Resume Free
                    <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>

              {/* Trust bullets — inline on mobile for scannability */}
              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                {["2 Free Scans", "No Card Required", "Results in 30s"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                    {t}
                  </span>
                ))}
              </div>

              {/* Social Proof Counters */}
              {socialProof.length > 0 && (
                <div className="flex flex-wrap items-center justify-center xl:justify-start gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  {socialProof.map(({ icon: Icon, value, label }) => (
                    <span key={label} className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="font-semibold text-foreground">{value.toLocaleString()}+</span>
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right content - Flip Card (desktop only) */}
          <HeroFlipCard />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
