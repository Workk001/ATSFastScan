import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import FoundersSection from "@/components/about/FoundersSection";
import ValuesSection from "@/components/about/ValuesSection";
import VisionSection from "@/components/about/VisionSection";

const About = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Helmet>
        <title>About ATS FastScan – AI Resume & Cover Letter Checker</title>
        <meta name="description" content="ATS FastScan is an AI-powered resume, cover letter, and LinkedIn profile ATS compatibility checker built for job seekers applying through Naukri, Workday, and Taleo systems." />
        <link rel="canonical" href="https://www.atsfastscan.com/about" />
      </Helmet>
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
