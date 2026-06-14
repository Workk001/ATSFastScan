import { Settings, CheckCircle, XCircle, FileText } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";

interface FormattingAnalysisProps {
  result: AnalysisResult;
}

const FormattingAnalysis = ({ result }: FormattingAnalysisProps) => {
  const { formatting_check, readability_check } = result;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const getLengthColor = (verdict: string) => {
    if (verdict === "optimal") return "text-success";
    return "text-warning";
  };

  const getLengthLabel = (verdict: string) => {
    const labels = {
      too_short: "Too Short",
      optimal: "Optimal Length",
      too_long: "Too Long"
    };
    return labels[verdict as keyof typeof labels] || verdict;
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center">
          <Settings className="w-5 h-5 text-warning" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Formatting & Readability</h2>
          <p className="text-sm text-muted-foreground">ATS compatibility check</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Formatting */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">ATS Formatting</h3>
          
          <div className={`p-4 rounded-xl border mb-4 ${formatting_check.ats_friendly ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20"}`}>
            <div className="flex items-center gap-2">
              {formatting_check.ats_friendly ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive" />
              )}
              <span className={formatting_check.ats_friendly ? "text-success" : "text-destructive"}>
                {formatting_check.ats_friendly ? "ATS Friendly" : "ATS Issues Detected"}
              </span>
            </div>
          </div>

          {formatting_check.issues.length > 0 && (
            <div className="space-y-2 mb-4">
              {formatting_check.issues.map((issue, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-foreground">
                  <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                  {issue}
                </div>
              ))}
            </div>
          )}

          <div className={`p-3 rounded-lg border ${formatting_check.page_count_ok ? "bg-success/10 border-success/20" : "bg-warning/10 border-warning/20"}`}>
            <div className="flex items-center gap-2">
              <FileText className={`w-4 h-4 ${formatting_check.page_count_ok ? "text-success" : "text-warning"}`} />
              <span className={`text-sm ${formatting_check.page_count_ok ? "text-success" : "text-warning"}`}>
                {formatting_check.page_count_ok ? "Page count is optimal (1-2 pages)" : "Consider adjusting resume length"}
              </span>
            </div>
          </div>
        </div>

        {/* Readability */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Readability</h3>
          
          <div className="p-4 rounded-xl bg-card/50 border border-border mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Clarity Score</span>
              <span className={`text-xl font-bold ${getScoreColor(readability_check.clarity_score)}`}>
                {readability_check.clarity_score}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Length</span>
              <span className={`font-medium ${getLengthColor(readability_check.length_verdict)}`}>
                {getLengthLabel(readability_check.length_verdict)}
              </span>
            </div>
          </div>

          {readability_check.grammar_issues.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Grammar Issues</p>
              <div className="space-y-2">
                {readability_check.grammar_issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-warning/10 border border-warning/20">
                    <XCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-warning">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormattingAnalysis;
