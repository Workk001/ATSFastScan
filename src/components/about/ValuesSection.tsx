import { motion } from "framer-motion";
import { Lightbulb, Eye, Rocket } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Leveraging cutting-edge AI to stay ahead of evolving ATS algorithms and deliver insights that truly make a difference.",
    gradient: "from-primary to-primary-glow",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Clear, actionable feedback on every aspect of your resume — no black boxes, just honest, data-driven guidance.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Rocket,
    title: "Empowerment",
    description: "Helping you succeed by providing the tools and knowledge to take control of your job search with confidence.",
    gradient: "from-primary-glow to-accent",
  },
];

const SectionDivider = () => (
  <div className="flex items-center gap-4 max-w-xs mx-auto mb-0">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
  </div>
);

const ValuesSection = () => {
  return (
    <section className="relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionDivider />
      </div>

      <div className="py-20 sm:py-28 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 sm:mb-18"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we build
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group"
              >
                <div className="relative rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-sm p-7 sm:p-9 h-full hover:border-primary/25 transition-all duration-400">
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-5`}
                    >
                      <value.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                    </motion.div>

                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
