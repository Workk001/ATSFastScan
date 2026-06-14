import { useState, useEffect, useCallback } from "react";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import { useIsMobile } from "@/hooks/use-mobile";

const testimonials = [
  {
    name: "Shaurya",
    initials: "S",
    role: "Job Seeker",
    quote:
      "ATS Fast Scan offers a smooth and efficient experience for handling document scans. Fast, simple, and efficient service. The process was smooth and saved me time.",
  },
  {
    name: "Radmila",
    initials: "R",
    role: "Job Seeker",
    quote:
      "When I first scanned my CV with ATS Fast Scan, my resume was on the medium hire probability. I liked so much that it didn't leave me in the dark with just a result — the result was elaborated on with detailed instructions on what I should work on. A few changes to the font and adding metrics & results — numbers and percentages — improved the score, and my resume was ready for the application.",
  },
  {
    name: "Rohan Desai",
    initials: "RD",
    role: "Software Engineer, Bengaluru",
    quote:
      "Honestly, I was skeptical — I've used a few ATS checkers before, and they just spit out a score with no context. ATS FastScan actually tells you why your score is what it is. It flagged that my bullet points were too vague and suggested adding measurable outcomes. Simple fix, big difference.",
  },
  {
    name: "David Fernandez",
    initials: "DF",
    role: "Mid-Level Project Manager, Dubai",
    quote:
      "I've been in the workforce for 7 years, so I assumed my resume was solid. ATS FastScan humbled me — it pointed out that I was repeating the same weak verbs throughout and that my summary section was too generic to pass keyword filters. The suggestions weren't vague either; it told me specifically what was missing based on the role I was targeting.",
  },
  {
    name: "James Whitfield",
    initials: "JW",
    role: "Recent MBA Graduate, Melbourne",
    quote:
      "I used this before applying to a competitive grad program intake. The cover letter analyzer especially stood out — it highlighted where my letter felt generic and where I needed to be more specific about impact. It felt like having a career counselor review your work, minus the waiting time.",
  },
  {
    name: "Arjun Nambiar",
    initials: "AN",
    role: "Final Year B.Tech Student, Hyderabad",
    quote:
      "Campus placements were coming up, and I had no idea if my resume would even clear the initial screening. Ran it through ATS FastScan and it flagged that my project descriptions were too technical with zero business context. Rewrote three bullet points to show impact rather than just process, and my score jumped noticeably. Got shortlisted in my first company itself.",
  },
  {
    name: "Priya Mehta",
    initials: "PM",
    role: "Marketing Graduate, Pune",
    quote:
      "I'd been applying for 3 weeks with zero callbacks. After running my resume through ATS FastScan, I realized I was missing half the keywords from the job descriptions I was targeting. The gap analysis was a game-changer. Fixed it in one evening, applied the next day, and had an interview call within 48 hours.",
  },
  {
    name: "Neeraj Tomar",
    initials: "NT",
    role: "Operations Analyst, Jaipur",
    quote:
      "What I liked most is that it doesn't overwhelm you. You get a clear score, a priority list of what to fix first, and a sense of exactly where you stand. I went from a 61% match to an 84% match in about an hour. The whole thing is straightforward enough that even someone who isn't super tech-savvy can use it without feeling lost.",
  },
  {
    name: "Ananya Srivastava",
    initials: "AS",
    role: "HR Professional, Delhi",
    quote:
      "I recommended ATS FastScan to a colleague who was struggling with his job search. His resume looked great visually but wasn't getting past screening. Turns out the formatting was the issue — the tool caught it immediately. He restructured it based on the suggestions and landed two interviews the following week.",
  },
  {
    name: "Sneha Kapoor",
    initials: "SK",
    role: "Content Writer transitioning to UX Writing, Mumbai",
    quote:
      "I was switching careers, so my resume had a lot of experience that didn't directly map to UX writing roles. ATS FastScan helped me understand which transferable skills to highlight and which keywords I was completely ignoring. It basically showed me how a recruiter's system sees my resume — not how I see it. That perspective shift alone was worth it.",
  },
  {
    name: "Mohit Sharma",
    initials: "MS",
    role: "Senior Data Analyst, Noida",
    quote:
      "What stood out to me was the cover letter analysis. I always treated cover letters as an afterthought, but ATS FastScan flagged that mine was missing role-specific language and came across as too generic. I rewrote it to mirror the job description more closely, and the response rate on my applications noticeably improved over the next two weeks.",
  },
  {
    name: "Kavya Reddy",
    initials: "KR",
    role: "Fresher, BBA Graduate, Chennai",
    quote:
      "As someone with no prior work experience, I was worried my resume had nothing to offer. The tool helped me reframe my internships and college projects in a way that actually spoke to recruiters. It also told me my resume length and format were off for entry-level roles. Small fixes, but they made my resume look far more intentional and professional.",
  },
];

const TestimonialCard = ({ t, fluid = false }: { t: typeof testimonials[0]; fluid?: boolean }) => (
  <div
    className={cn(
      "group relative rounded-2xl p-6 sm:p-8 shrink-0",
      fluid ? "w-full" : "w-[340px] sm:w-[400px]",
      "bg-card/80 backdrop-blur-sm border border-border/40",
      "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
      "transition-shadow duration-300"
    )}
  >
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative z-10 flex flex-col">
      <Quote className="w-8 h-8 text-primary/20 mb-4" />

      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
        ))}
      </div>

      <p className="text-foreground/85 leading-relaxed mb-6 text-sm sm:text-[15px]">
        "{t.quote}"
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-border/30">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 flex items-center justify-center text-primary font-bold text-sm shrink-0">
          {t.initials}
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{t.name}</p>
          <p className="text-muted-foreground text-xs">{t.role}</p>
        </div>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const isMobile = useIsMobile();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    setCount(api.scrollSnapList().length);
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-14 px-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            Trusted by Job Seekers{" "}
            <span className="text-gradient">Worldwide</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real stories from people who improved their resumes and landed
            interviews
          </p>
        </div>

        {/* Carousel with auto-scroll + swipe */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <Carousel
            setApi={setApi}
            opts={{
              loop: true,
              dragFree: true,
              align: "start",
            }}
            plugins={[
              AutoScroll({
                speed: isMobile ? 0.8 : 1.2,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
                stopOnFocusIn: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4 sm:-ml-6">
              {testimonials.map((t, idx) => (
                <CarouselItem
                  key={idx}
                  className="pl-4 sm:pl-6 basis-[85%] sm:basis-[55%] lg:basis-[32%]"
                >
                  <TestimonialCard t={t} fluid />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dot indicators — mobile/tablet only */}
          {count > 0 && (
            <div className="flex justify-center gap-2 mt-6 lg:hidden">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    i === current
                      ? "bg-primary w-6"
                      : "bg-border hover:bg-muted-foreground/40"
                  )}
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
