import { Target, CheckCircle, XCircle, Briefcase } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";

interface JDMatchSectionProps {
  result: AnalysisResult;
}

const JDMatchSection = ({ result }: JDMatchSectionProps) => {
  if (!result.jd_match) return null;

  const { match_percentage, matched_skills, missing_skills, matched_soft_skills, missing_soft_skills, job_title_match, recommendations } = result.jd_match;

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 50) return "text-warning";
    return "text-destructive";
  };

  const getMatchLabel = (percentage: number) => {
    if (percentage >= 80) return "Excellent Match";
    if (percentage >= 60) return "Good Match";
    if (percentage >= 40) return "Partial Match";
    return "Poor Match";
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
          <Target className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Job Description Match</h2>
          <p className="text-sm text-muted-foreground">How well your resume fits the role</p>
        </div>
      </div>

      {/* Match Score */}
      <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-card/50 border border-border">
        <div className="flex items-center gap-3">
          <span className={`text-4xl font-bold ${getMatchColor(match_percentage)}`}>
            {match_percentage}%
          </span>
          <div>
            <p className={`font-semibold ${getMatchColor(match_percentage)}`}>{getMatchLabel(match_percentage)}</p>
            <p className="text-sm text-muted-foreground">Overall match score</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className={`w-5 h-5 ${job_title_match ? "text-success" : "text-warning"}`} />
          <span className="text-sm text-muted-foreground">
            {job_title_match ? "Title aligned" : "Title mismatch"}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Hard Skills */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            Matched Hard Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {matched_skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-sm bg-success/10 text-success border border-success/20">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-destructive" />
            Missing Hard Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {missing_skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-sm bg-destructive/10 text-destructive border border-destructive/20">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            Matched Soft Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {matched_soft_skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-sm bg-success/10 text-success border border-success/20">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-warning" />
            Missing Soft Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {missing_soft_skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-sm bg-warning/10 text-warning border border-warning/20">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recommendations</h3>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-primary">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JDMatchSection;
