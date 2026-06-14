import { Linkedin, Sparkles, Hash, Lightbulb } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";

interface LinkedInSectionProps {
  result: AnalysisResult;
}

const LinkedInSection = ({ result }: LinkedInSectionProps) => {
  if (!result.linkedin_optimization) return null;

  const { headline_suggestion, summary_suggestion, skills_to_add, profile_tips, keyword_optimization } = result.linkedin_optimization;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Linkedin className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">LinkedIn Optimization</h2>
          <p className="text-sm text-muted-foreground">Enhance your professional profile</p>
        </div>
      </div>

      {/* Headline */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Suggested Headline</h3>
        </div>
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <p className="text-foreground font-medium">{headline_suggestion}</p>
          <p className="text-xs text-muted-foreground mt-1">{headline_suggestion.length}/120 characters</p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">About Section Suggestion</h3>
        </div>
        <div className="p-4 rounded-xl bg-card/50 border border-border">
          <p className="text-foreground text-sm leading-relaxed">{summary_suggestion}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-4 h-4 text-success" />
            <h3 className="text-sm font-semibold text-muted-foreground">Skills to Add</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills_to_add.map((skill, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-sm bg-success/10 text-success border border-success/20">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-muted-foreground">Keywords to Emphasize</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {keyword_optimization.map((keyword, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Tips */}
      {profile_tips.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-warning" />
            <h3 className="text-sm font-semibold text-muted-foreground">Profile Optimization Tips</h3>
          </div>
          <ul className="space-y-2">
            {profile_tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-primary">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LinkedInSection;
