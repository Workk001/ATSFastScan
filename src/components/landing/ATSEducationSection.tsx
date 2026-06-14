import { ShieldCheck, Search, FileText, AlignLeft, Target } from "lucide-react";

const checks = [
  { icon: Search, text: "Relevant keywords" },
  { icon: FileText, text: "Proper formatting" },
  { icon: AlignLeft, text: "Clear section structure" },
  { icon: Target, text: "Job description alignment" },
];

const ATSEducationSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 relative lazy-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-14 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/25 text-xs sm:text-sm font-semibold text-primary animate-slide-up-fade">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Understanding ATS</span>
            </div>
            <h2
              className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-extrabold text-foreground animate-slide-up-fade tracking-tight leading-[1.2]"
              style={{ animationDelay: "0.1s" }}
            >
              What is ATS and Why It{" "}
              <span className="text-gradient">Rejects Resumes</span>?
            </h2>
          </div>

          <div
            className="glass-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 animate-slide-up-fade"
            style={{ animationDelay: "0.2s" }}
          >
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-[1.8] mb-6 sm:mb-8">
              Applicant Tracking Systems (ATS) are software tools used by
              companies to filter resumes before a recruiter sees them. They
              scan for:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {checks.map((item, index) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/10 animate-slide-up-fade"
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-foreground">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-sm sm:text-base text-muted-foreground leading-[1.8]">
              If your resume doesn't match what the system expects, it may be
              rejected automatically — even if you're qualified.{" "}
              <span className="text-primary font-semibold">
                ATS FastScan shows you exactly how your resume performs before
                you apply.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ATSEducationSection;
