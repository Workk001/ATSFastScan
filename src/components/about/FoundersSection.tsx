import { motion } from "framer-motion";
import { Linkedin, Github, MapPin, Phone, Mail } from "lucide-react";
import aadityaImg from "@/assets/aaditya.jpeg";
import dhruvImg from "@/assets/dhruv.png";

const founders = [
  {
    name: "Dhruv",
    title: "Founder & CEO",
    role: "Full-Stack Developer",
    location: "India",
    email: "dhruv@atsfastscan.com",
    image: dhruvImg,
    bio: "Full-stack developer and entrepreneur passionate about solving real-world problems through AI. Co-built ATS FastScan to help job seekers navigate modern hiring systems with intelligent resume optimization.",
    linkedIn: "https://www.linkedin.com/in/dhruv-kumar-coder",
    github: "https://github.com/Workk001",
  },
  {
    name: "Aaditya",
    title: "Co-Founder",
    role: "Data Scientist",
    location: "New Zealand",
    email: "aaditya@atsfastscan.com",
    image: aadityaImg,
    bio: "Data scientist and technologist who co-built ATS FastScan's AI engine. Dedicated to making job applications more efficient by empowering candidates with data-driven insights and intelligent analysis.",
    linkedIn: "https://www.linkedin.com/in/aaditya-karande-a12a48260/",
    github: "https://github.com/aadi9082",
  },
];

const SectionDivider = () => (
  <div className="flex items-center gap-4 max-w-xs mx-auto mb-0">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
  </div>
);

const FoundersSection = () => {
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
              Meet the{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Founders</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Two friends, two countries, one mission — building the future of job applications together.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-5xl mx-auto">
            {founders.map((founder, i) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group"
              >
                <div className="relative rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm overflow-hidden hover:border-primary/25 transition-all duration-400 h-full flex flex-col">
                  {/* Top: Avatar + Name */}
                  <div className="flex flex-col items-center text-center pt-8 sm:pt-10 px-6 sm:px-8">
                    {/* Circle Avatar with gradient ring */}
                    <div className="relative mb-5">
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent p-[3px] group-hover:from-primary/80 group-hover:to-accent/80 transition-all duration-500">
                          <div className="w-full h-full rounded-full bg-background p-[2px]">
                            <img
                              src={founder.image}
                              alt={`${founder.name} - ${founder.title}`}
                              width={128}
                              height={128}
                              className="w-full h-full rounded-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-0.5">{founder.name}</h3>
                    <p className="text-sm sm:text-base font-semibold text-primary mb-1">{founder.title}</p>
                    <p className="text-xs text-muted-foreground">{founder.role}</p>
                  </div>

                  {/* ABOUT Section */}
                  <div className="px-6 sm:px-8 pt-6">
                    <h4 className="text-[13px] font-bold text-foreground tracking-wider uppercase mb-3">About</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{founder.bio}</p>
                    {/* Social Icons */}
                    <div className="flex items-center gap-3 mb-2">
                      <a
                        href={founder.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${founder.name}'s LinkedIn`}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{ backgroundColor: "rgba(93,133,193,0.05)" }}
                      >
                        <Linkedin className="w-4 h-4 text-primary" />
                      </a>
                      <a
                        href={founder.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${founder.name}'s GitHub`}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{ backgroundColor: "rgba(93,133,193,0.05)" }}
                      >
                        <Github className="w-4 h-4 text-primary" />
                      </a>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="mx-6 sm:mx-8 my-4 h-px bg-border" />

                  {/* CONTACT Section */}
                  <div className="px-6 sm:px-8 pb-8 flex flex-col flex-1">
                    <h4 className="text-[13px] font-bold text-foreground tracking-wider uppercase mb-4">Contact</h4>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{founder.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0">
                          <Mail className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{founder.email}</span>
                      </div>
                    </div>

                    <a
                      href={`mailto:${founder.email}`}
                      className="mt-auto w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Work Together
                    </a>
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

export default FoundersSection;
