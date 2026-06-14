import { FileText, XCircle, AlertTriangle, CheckCircle } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";

interface ExperienceQualityProps {
  result: AnalysisResult;
}

const ExperienceQuality = ({ result }: ExperienceQualityProps) => {
  const { action_verbs_score, metrics_score, relevance_score, overall_score, weak_bullets, generic_phrases } = result.experience_quality;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 50) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Experience Quality</h2>
          <p className="text-sm text-muted-foreground">Bullet point effectiveness</p>
        </div>
      </div>

      {/* Score Overview */}
      <div className="p-4 rounded-xl bg-card/50 border border-border mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">Overall Quality Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(overall_score)}`}>{overall_score}%</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Action Verbs</span>
              <span className={getScoreColor(action_verbs_score)}>{action_verbs_score}%</span>
            </div>
            <div className="h-2 rounded-full bg-border/50 overflow-hidden">
              <div className={`h-full rounded-full ${getBarColor(action_verbs_score)}`} style={{ width: `${action_verbs_score}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Metrics</span>
              <span className={getScoreColor(metrics_score)}>{metrics_score}%</span>
            </div>
            <div className="h-2 rounded-full bg-border/50 overflow-hidden">
              <div className={`h-full rounded-full ${getBarColor(metrics_score)}`} style={{ width: `${metrics_score}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Relevance</span>
              <span className={getScoreColor(relevance_score)}>{relevance_score}%</span>
            </div>
            <div className="h-2 rounded-full bg-border/50 overflow-hidden">
              <div className={`h-full rounded-full ${getBarColor(relevance_score)}`} style={{ width: `${relevance_score}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Weak Bullets */}
      {weak_bullets.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Bullets to Improve</h3>
          <div className="space-y-4">
            {weak_bullets.map((bullet, index) => (
              <div key={index} className="p-5 rounded-xl bg-card/50 border border-border hover:border-primary/20 transition-colors">
                <div className="mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-destructive" />
                    <span className="text-xs font-semibold text-destructive uppercase tracking-wider">Original</span>
                  </div>
                  <p className="text-foreground/60 line-through">{bullet.original}</p>
                </div>
                <div className="mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span className="text-xs font-semibold text-warning uppercase tracking-wider">Issue</span>
                  </div>
                  <p className="text-muted-foreground">{bullet.issue}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-xs font-semibold text-success uppercase tracking-wider">Suggested Rewrite</span>
                  </div>
                  <p className="text-foreground font-medium">{bullet.rewrite}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generic Phrases */}
      {generic_phrases.length > 0 && (
        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Avoid These Generic Phrases</h3>
          <div className="flex flex-wrap gap-2">
            {generic_phrases.map((phrase, index) => (
              <span key={index} className="px-4 py-2 rounded-lg text-sm bg-destructive/5 text-destructive/80 border border-destructive/20 line-through">
                {phrase}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceQuality;
