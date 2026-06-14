import { Users, FileCheck, Zap, TrendingUp } from "lucide-react";
import { useSiteStats } from "@/hooks/useSiteStats";

const TrustSection = () => {
  const { data: stats } = useSiteStats();
  const totalScans = stats?.totalScans ?? 0;

  const displayStats = [
    {
      icon: Zap,
      value: "30s",
      label: "Average Analysis Time",
      gradient: "from-primary to-blue-400",
    },
    {
      icon: TrendingUp,
      value: "+34 pts",
      label: "Avg Score Improvement",
      gradient: "from-primary to-cyan-400",
    },
    {
      icon: Users,
      value: totalScans > 0 ? `${totalScans}+` : "500+",
      label: "Resumes Scanned",
      gradient: "from-primary to-sky-400",
    },
    {
      icon: FileCheck,
      value: "87%",
      label: "Users Improved Their Score",
      gradient: "from-primary to-indigo-400",
    },
  ];

  return (
    <section className="py-10 sm:py-14 lg:py-16 relative -mt-4 sm:-mt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-8 max-w-5xl mx-auto">
          {displayStats.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 animate-slide-up-fade"
              style={{ animationDelay: `${0.05 + index * 0.05}s` }}
            >
              <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative flex flex-col items-center text-center gap-2 sm:gap-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight leading-none">{stat.value}</p>
                  <p className="text-[0.65rem] sm:text-xs text-muted-foreground font-medium mt-1 sm:mt-1.5">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
