import { Search, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";

interface KeywordsListProps {
  result: AnalysisResult;
}

const KeywordsList = ({ result }: KeywordsListProps) => {
  const { matched_keywords, missing_keywords, keyword_density_score, stuffing_detected } = result.keyword_analysis;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
          <Search className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Keyword Analysis</h2>
          <p className="text-sm text-muted-foreground">ATS keyword optimization</p>
        </div>
      </div>

      {/* Density Score */}
      <div className="flex items-center justify-between mb-4 p-4 rounded-xl bg-card/50 border border-border">
        <div>
          <p className="text-sm text-muted-foreground">Keyword Density Score</p>
          <p className={`text-2xl font-bold ${getScoreColor(keyword_density_score)}`}>
            {keyword_density_score}%
          </p>
        </div>
        {stuffing_detected && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/10 border border-warning/20">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-sm text-warning font-medium">Keyword stuffing detected</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Matched Keywords */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            Matched Keywords ({matched_keywords.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {matched_keywords.map((keyword, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-sm bg-success/10 text-success border border-success/20">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-destructive" />
            Missing Keywords ({missing_keywords?.length || 0})
          </h3>
          <div className="flex flex-wrap gap-2">
            {missing_keywords && missing_keywords.length > 0 ? (
              missing_keywords.map((keyword, index) => (
                <span key={index} className="px-3 py-1 rounded-full text-sm bg-destructive/10 text-destructive border border-destructive/20">
                  {keyword}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground italic">No missing keywords — great job!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordsList;
