import { User, Briefcase, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";

interface RoleDetectionSectionProps {
  result: AnalysisResult;
}

const RoleDetectionSection = ({ result }: RoleDetectionSectionProps) => {
  if (!result.role_detection) return null;

  const { detected_role, confidence, industry, experience_level, role_specific_keywords } = result.role_detection;

  // Deduplicate: remove any keyword from missing list that already exists in found list
  const foundSet = new Set(role_specific_keywords.map(k => k.toLowerCase()));
  const missing_role_keywords = result.role_detection.missing_role_keywords.filter(
    k => !foundSet.has(k.toLowerCase())
  );

  const getLevelBadge = (level: string) => {
    const styles = {
      entry: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      mid: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      senior: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      executive: "bg-amber-500/10 text-amber-400 border-amber-500/20"
    };
    return styles[level as keyof typeof styles] || styles.mid;
  };

  const getLevelLabel = (level: string) => {
    const labels = {
      entry: "Entry Level",
      mid: "Mid Level",
      senior: "Senior Level",
      executive: "Executive"
    };
    return labels[level as keyof typeof labels] || "Mid Level";
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Role Detection</h2>
          <p className="text-sm text-muted-foreground">Identified target role and experience</p>
        </div>
      </div>

      {/* Role Info */}
      <div className="p-4 rounded-xl bg-card/50 border border-border mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold text-foreground">{detected_role}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelBadge(experience_level)}`}>
            {getLevelLabel(experience_level)}
          </span>
          <span className="px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground border border-border">
            {industry}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {confidence}% confidence
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Found Keywords */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            Role Keywords Found
          </h3>
          <div className="flex flex-wrap gap-2">
            {role_specific_keywords.map((keyword, index) => (
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
            Missing Role Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {missing_role_keywords.map((keyword, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-sm bg-destructive/10 text-destructive border border-destructive/20">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleDetectionSection;
