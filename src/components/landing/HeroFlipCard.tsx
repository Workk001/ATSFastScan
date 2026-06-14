import { useState, useEffect, useRef } from "react";
import { CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResumeCardProps {
  filename: string;
  uploadTime: string;
  summary: string;
  experiences: { title: string; company: string; years: string }[];
  skills: string[];
  score: number;
  accentColor: "primary" | "accent";
}

const ResumeCardSide = ({ 
  filename, 
  uploadTime, 
  summary, 
  experiences, 
  skills, 
  score, 
  accentColor,
  animateScore 
}: ResumeCardProps & { animateScore: boolean }) => {
  const scoreRef = useRef<SVGCircleElement>(null);
  const circumference = 301.6; // 2 * PI * 48
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    if (animateScore && scoreRef.current) {
      scoreRef.current.style.strokeDashoffset = String(circumference);
      requestAnimationFrame(() => {
        if (scoreRef.current) {
          scoreRef.current.style.transition = "stroke-dashoffset 1.5s ease-out";
          scoreRef.current.style.strokeDashoffset = String(offset);
        }
      });
    }
  }, [animateScore, offset]);

  const colorClasses = accentColor === "primary" 
    ? { bg: "bg-primary/20", border: "border-primary/25", text: "text-primary", hover: "hover:bg-primary/25 hover:border-primary/40" }
    : { bg: "bg-accent/20", border: "border-accent/25", text: "text-accent", hover: "hover:bg-accent/25 hover:border-accent/40" };

  return (
    <>
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl ${colorClasses.bg} flex items-center justify-center text-xl transition-all duration-300 hover:scale-110`}>
            📄
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{filename}</h3>
            <p className="text-xs text-muted-foreground">{uploadTime}</p>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 grid grid-cols-[1fr_120px] gap-5 overflow-hidden">
        {/* Resume Content */}
        <div className="flex flex-col gap-4 overflow-y-auto scrollbar-hide pr-1">
          <div className="flex flex-col gap-1.5">
            <p className={`text-[0.65rem] font-bold uppercase ${colorClasses.text} tracking-wider`}>Summary</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {summary}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className={`text-[0.65rem] font-bold uppercase ${colorClasses.text} tracking-wider`}>Experience</p>
            <div className="space-y-2">
              {experiences.map((exp, i) => (
                <div key={i}>
                  <p className="text-[13px] font-semibold text-foreground">{exp.title}</p>
                  <p className="text-xs text-muted-foreground">{exp.company} • {exp.years}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className={`text-[0.65rem] font-bold uppercase ${colorClasses.text} tracking-wider`}>Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className={`px-2 py-0.5 text-[11px] rounded-md ${colorClasses.bg} border ${colorClasses.border} font-medium ${colorClasses.text} transition-all duration-300 ${colorClasses.hover}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Score Circle */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-[110px] h-[110px] flex items-center justify-center">
            <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 110 110">
              <circle 
                cx="55" 
                cy="55" 
                r="48" 
                fill="none" 
                stroke="rgba(255,255,255,0.08)" 
                strokeWidth="8" 
              />
              <circle
                ref={scoreRef}
                cx="55"
                cy="55"
                r="48"
                fill="none"
                stroke="hsl(142, 76%, 46%)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                style={{ transition: "none" }}
              />
            </svg>
            <div className="relative z-10 text-center">
              <p className="text-3xl font-extrabold text-success leading-none mb-0.5 tracking-tight">
                {score}
              </p>
              <p className="text-[0.55rem] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">
                ATS Score
              </p>
              <span className="text-[10px] font-semibold text-success px-2 py-0.5 rounded-md bg-success/10">
                Excellent
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const HeroFlipCard = () => {
  const isMobile = useIsMobile();
  const [isFlipped, setIsFlipped] = useState(false);
  const [animateFront, setAnimateFront] = useState(true);
  const [animateBack, setAnimateBack] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (isMobile) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setIsFlipped((prev) => {
        const next = !prev;
        if (next) { setAnimateBack(true); setTimeout(() => setAnimateBack(false), 100); }
        else { setAnimateFront(true); setTimeout(() => setAnimateFront(false), 100); }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isMobile, prefersReducedMotion]);

  if (isMobile) return null;

  const handleClick = () => {
    setIsFlipped((prev) => {
      const next = !prev;
      if (next) { setAnimateBack(true); setTimeout(() => setAnimateBack(false), 100); }
      else { setAnimateFront(true); setTimeout(() => setAnimateFront(false), 100); }
      return next;
    });
  };

  const frontData: ResumeCardProps = {
    filename: "DhruvKumar_Resume.pdf",
    uploadTime: "Uploaded just now",
    summary: "Full Stack Developer with expertise in React, Node.js, and modern web technologies. Passionate about building scalable applications.",
    experiences: [
      { title: "Full Stack Developer", company: "Tech Solutions", years: "2022 - Present" },
      { title: "Frontend Developer", company: "Digital Agency", years: "2020 - 2022" },
    ],
    skills: ["React", "Next.js", "Node.js", "MongoDB", "TypeScript"],
    score: 92,
    accentColor: "primary",
  };

  const backData: ResumeCardProps = {
    filename: "AadityaKarande_Resume.pdf",
    uploadTime: "Uploaded 5 mins ago",
    summary: "Data Analyst with strong analytical skills and expertise in Python, SQL, and Power BI. Specializing in actionable insights.",
    experiences: [
      { title: "Data Analyst", company: "Analytics Corp", years: "2021 - Present" },
      { title: "Business Analyst", company: "Consulting Firm", years: "2019 - 2021" },
    ],
    skills: ["Python", "SQL", "Power BI", "Excel", "Tableau"],
    score: 95,
    accentColor: "accent",
  };

  return (
    <div 
      className="hidden xl:block animate-fade-in-card" 
      style={{ perspective: "1500px" }}
    >
      <div
        className="w-[420px] h-[520px] relative cursor-pointer mx-auto"
        style={{ transformStyle: "preserve-3d" }}
        onClick={handleClick}
      >
        <div
          className="w-full h-full relative"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: prefersReducedMotion 
              ? "none" 
              : "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Front Side */}
          <div
            className="absolute w-full h-full glass-card rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col border border-primary/20 overflow-hidden"
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            <ResumeCardSide {...frontData} animateScore={animateFront} />
          </div>

          {/* Back Side */}
          <div
            className="absolute w-full h-full glass-card rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col border border-accent/20 overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <ResumeCardSide {...backData} animateScore={animateBack} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroFlipCard;
