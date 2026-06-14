import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const AboutHero = () => {
  return (
    <section className="relative pt-28 sm:pt-36 lg:pt-44 pb-20 sm:pb-28 lg:pb-32 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 sm:space-y-8 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-gentle" />
            <span className="text-xs sm:text-sm font-semibold text-primary tracking-wide uppercase">About Us</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight">
            <span className="text-foreground">Transforming Job</span>
            <br />
            <span className="text-foreground">Applications with </span>
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're revolutionizing how candidates navigate modern hiring systems — 
            ensuring talent gets seen, not filtered out by algorithms.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 sm:mt-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground/60 cursor-pointer"
            onClick={() => document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" })}
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
