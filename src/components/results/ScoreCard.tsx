import type { AnalysisResult } from "@/types/analysis";

interface ScoreCardProps {
  result: AnalysisResult;
}

const ScoreCard = ({ result }: ScoreCardProps) => {
  const score = result.final_verdict.ats_score;
  const hireProbability = result.final_verdict.hire_probability;
  const summary = result.final_verdict.summary;
  const breakdown = result.score_breakdown;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const getHireBadgeClass = (prob: string) => {
    switch (prob) {
      case "High":
        return "bg-success/15 text-success border-success/30";
      case "Medium":
        return "bg-warning/15 text-warning border-warning/30";
      default:
        return "bg-destructive/15 text-destructive border-destructive/30";
    }
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 50) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="glass-card rounded-2xl p-8 sm:p-10 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Circular score */}
        <div className="relative flex-shrink-0 w-44 h-44">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 176 176">
            <circle
              cx="88"
              cy="88"
              r="76"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-border/50"
            />
            <circle
              cx="88"
              cy="88"
              r="76"
              stroke="url(#scoreGradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 477.52} 477.52`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-sm text-muted-foreground font-medium">ATS Score</span>
          </div>
        </div>

        {/* Summary */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Resume Analysis</h1>
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getHireBadgeClass(hireProbability)}`}>
              {hireProbability} Hire Probability
            </span>
          </div>
          <p className="text-muted-foreground text-lg mb-6 max-w-lg">
            {summary}
          </p>

          {/* Score Breakdown Bars */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Keywords</span>
                <span className={getScoreColor(breakdown.keyword_match)}>{breakdown.keyword_match}%</span>
              </div>
              <div className="h-2 rounded-full bg-border/50 overflow-hidden">
                <div className={`h-full rounded-full ${getBarColor(breakdown.keyword_match)} transition-all duration-1000`} style={{ width: `${breakdown.keyword_match}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Experience</span>
                <span className={getScoreColor(breakdown.experience_quality)}>{breakdown.experience_quality}%</span>
              </div>
              <div className="h-2 rounded-full bg-border/50 overflow-hidden">
                <div className={`h-full rounded-full ${getBarColor(breakdown.experience_quality)} transition-all duration-1000`} style={{ width: `${breakdown.experience_quality}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Formatting</span>
                <span className={getScoreColor(breakdown.formatting)}>{breakdown.formatting}%</span>
              </div>
              <div className="h-2 rounded-full bg-border/50 overflow-hidden">
                <div className={`h-full rounded-full ${getBarColor(breakdown.formatting)} transition-all duration-1000`} style={{ width: `${breakdown.formatting}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Readability</span>
                <span className={getScoreColor(breakdown.readability)}>{breakdown.readability}%</span>
              </div>
              <div className="h-2 rounded-full bg-border/50 overflow-hidden">
                <div className={`h-full rounded-full ${getBarColor(breakdown.readability)} transition-all duration-1000`} style={{ width: `${breakdown.readability}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
