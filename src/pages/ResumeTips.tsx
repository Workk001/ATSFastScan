import Footer from "@/components/Footer";
import { FileText, Target, Layout, Type, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";

const ResumeTips = () => {
  const tips = [
    {
      icon: FileText,
      title: "Use a Clean Format",
      description: "Stick to standard fonts like Arial, Calibri, or Times New Roman. Avoid tables, headers/footers, and graphics that ATS systems can't parse.",
      dos: ["Use simple bullet points", "Keep margins at 0.5-1 inch", "Save as PDF or DOCX"],
      donts: ["Use fancy templates", "Include images or logos", "Use text boxes"]
    },
    {
      icon: Target,
      title: "Optimize Keywords",
      description: "Mirror the exact keywords from the job description. ATS systems look for specific terms and skills mentioned in the posting.",
      dos: ["Match job title exactly", "Include relevant skills verbatim", "Use industry-standard terms"],
      donts: ["Stuff keywords unnaturally", "Use abbreviations only", "Ignore the job description"]
    },
    {
      icon: Layout,
      title: "Structure Matters",
      description: "Use clear section headings that ATS systems recognize: Experience, Education, Skills, Summary. Keep the layout consistent.",
      dos: ["Use standard section titles", "Put experience in reverse chronological order", "Include dates for each role"],
      donts: ["Use creative section names", "Combine sections", "Leave gaps unexplained"]
    },
    {
      icon: Type,
      title: "Quantify Achievements",
      description: "Numbers stand out to both ATS and human reviewers. Quantify your impact whenever possible.",
      dos: ["Include percentages and numbers", "Show revenue impact", "Mention team sizes managed"],
      donts: ["Use vague descriptions", "Focus only on responsibilities", "Forget metrics"]
    }
  ];

  const quickTips = [
    "Use standard section headings (Experience, Education, Skills)",
    "Include the exact job title from the posting",
    "List technical skills in a dedicated section",
    "Avoid headers and footers - ATS may skip them",
    "Don't use special characters or symbols",
    "Keep file name simple: FirstName_LastName_Resume.pdf",
    "Spell out acronyms at least once",
    "Use consistent date formatting throughout"
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 sm:pt-28 lg:pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              Resume Tips
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
              Optimize Your Resume for{" "}
              <span className="text-primary">ATS Success</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow these proven strategies to ensure your resume gets past automated 
              screening systems and into the hands of recruiters.
            </p>
          </div>
        </section>

        {/* Quick Tips */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-primary/5 rounded-3xl border border-primary/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Quick Tips</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {quickTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-foreground">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Tips */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {tips.map((tip, index) => (
              <div 
                key={index}
                className="bg-card/30 rounded-3xl border border-border/50 p-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <tip.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{tip.title}</h3>
                    <p className="text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-emerald-500/5 rounded-xl border border-emerald-500/20 p-4">
                    <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Do
                    </h4>
                    <ul className="space-y-2">
                      {tip.dos.map((item, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-destructive/5 rounded-xl border border-destructive/20 p-4">
                    <h4 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Don't
                    </h4>
                    <ul className="space-y-2">
                      {tip.donts.map((item, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-destructive mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ResumeTips;
