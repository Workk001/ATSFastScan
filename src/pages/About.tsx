import Footer from "@/components/Footer";

import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import FoundersSection from "@/components/about/FoundersSection";
import ValuesSection from "@/components/about/ValuesSection";
import VisionSection from "@/components/about/VisionSection";

const About = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <main className="relative z-10">
        <AboutHero />
        <OurStory />
        <FoundersSection />
        <ValuesSection />
        <VisionSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
