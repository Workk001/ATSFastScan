import { Zap, Target, BarChart3, Shield, Clock, Lightbulb } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get your complete analysis before your coffee gets cold. Results in under 30 seconds.",
    colorClass: "primary",
  },
  {
    icon: Target,
    title: "Keyword Analysis",
    description: "See if your resume contains the right keywords that ATS systems and recruiters look for.",
    colorClass: "accent",
  },
  {
    icon: BarChart3,
    title: "Clear Score",
    description: "Receive a clear 0-100 score with specific areas for improvement, no confusing jargon.",
    colorClass: "success",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your resume is analyzed in real-time and immediately deleted. We never store your data.",
    colorClass: "primary",
  },
  {
    icon: Clock,
    title: "Save Hours",
    description: "Stop guessing what is wrong. Know exactly what to fix before you submit your application.",
    colorClass: "accent",
  },
  {
    icon: Lightbulb,
    title: "Smart Suggestions",
    description: "Get actionable tips tailored to your resume and industry to improve your chances.",
    colorClass: "success",
  },
];

const getColorClasses = (colorClass: string) => {
  switch (colorClass) {
    case "primary":
      return {
        bg: "bg-primary/15",
        border: "border-primary/25",
        text: "text-primary",
      };
    case "accent":
      return {
        bg: "bg-accent/15",
        border: "border-accent/25",
        text: "text-accent",
      };
    case "success":
      return {
        bg: "bg-success/15",
        border: "border-success/25",
        text: "text-success",
      };
    default:
      return {
        bg: "bg-primary/15",
        border: "border-primary/25",
        text: "text-primary",
      };
  }
};

const FeaturesGrid = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 relative lazy-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-16 max-w-3xl mx-auto space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 border border-accent/25 text-xs sm:text-sm font-semibold text-accent animate-slide-up-fade">
            <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Features</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-extrabold text-foreground animate-slide-up-fade tracking-tight leading-[1.2]" style={{ animationDelay: "0.1s" }}>
            Why Job Seekers <span className="text-gradient">Love This</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground animate-slide-up-fade leading-[1.7] max-w-xl mx-auto" style={{ animationDelay: "0.2s" }}>
            We built this because we were tired of applying and never hearing back.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.colorClass);
            return (
              <div
                key={feature.title}
                className="group glass-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-5 sm:p-7 lg:p-10 transition-all duration-400 hover:-translate-y-1 sm:hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl animate-slide-up-fade"
                style={{ animationDelay: `${0.1 + index * 0.06}s` }}
              >
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-[1.7]">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
