import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SectionDivider = () => (
  <div className="flex items-center gap-4 max-w-xs mx-auto mb-0">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
  </div>
);

const VisionSection = () => {
  return (
    <section className="relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionDivider />
      </div>

      <div className="py-20 sm:py-28 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Building the Future of{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Job Applications
              </span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're just getting started. From smarter keyword optimization to real-time job matching, 
              we're continuously evolving to give you the best possible chance of landing your dream role.
            </p>

            <div className="pt-2">
              <Button asChild variant="glow" size="xl">
                <Link to="/upload" className="group">
                  Join Us on This Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
