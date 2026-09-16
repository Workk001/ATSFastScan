import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Users, Clock } from "lucide-react";
import { useSiteStats } from "@/hooks/useSiteStats";

const SectionDivider = () => (
  <div className="flex items-center gap-4 max-w-xs mx-auto my-0">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
  </div>
);

const OurStory = () => {
  const { data: siteStats } = useSiteStats();
  const totalResumes = siteStats?.totalResumes ?? 0;

  const stats = [
    {
      icon: Users,
      value: totalResumes > 0 ? `${totalResumes}+` : "—",
      label: "Resumes Optimized",
      gradient: "from-primary to-primary-glow",
    },
    { icon: TrendingUp, value: "90%", label: "Success Rate", gradient: "from-accent to-primary" },
    { icon: Clock, value: "30s", label: "Average Analysis", gradient: "from-primary-glow to-accent" },
  ];

  return (
    <section id="our-story" className="relative">
      {/* Top divider */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionDivider />
      </div>

      <div className="py-20 sm:py-28 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14 sm:mb-18"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary">Our Story</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Why We Built{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ATS FastScan
                </span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                The problem was clear. The solution needed to be built.
              </p>
            </motion.div>

            {/* Story content */}
            <div className="max-w-3xl mx-auto mb-16 sm:mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="space-y-6 text-muted-foreground leading-[1.8] text-sm sm:text-base lg:text-lg"
              >
                <p>
                  Every year, millions of qualified candidates are rejected by Applicant Tracking Systems before a human
                  recruiter ever sees their resume. Not because they lack talent — but because their resumes aren't
                  optimized for the algorithms that screen them.
                </p>
                <p>
                  We experienced this frustration firsthand. Despite having strong skills and experience, our
                  applications were being filtered out. We realized the problem wasn't the candidates — it was the
                  system.
                </p>
                <p>
                  That's why we built ATS FastScan: an AI-powered platform that gives every job seeker the tools and
                  insights to navigate modern hiring systems with confidence.
                </p>
              </motion.div>

              {/* Mission card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-10 sm:mt-12"
              >
                <div className="rounded-2xl border border-primary/15 bg-card/50 backdrop-blur-sm p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base mb-4">
                    To eliminate the barrier between talent and opportunity. We believe every qualified candidate
                    deserves a fair chance — and we're building the tools to make that happen.
                  </p>
                  <div className="h-px bg-border/50 mb-4" />
                  <p className="text-sm text-primary font-medium italic">
                    "Helping thousands optimize their applications and land interviews they deserve."
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-sm p-5 sm:p-8 text-center hover:border-primary/25 transition-all duration-400"
                >
                  <div className="relative">
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 sm:mb-4`}
                    >
                      <stat.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
