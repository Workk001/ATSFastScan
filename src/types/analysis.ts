// Weak bullet with rewrite suggestion
export interface WeakBullet {
  original: string;
  issue: string;
  rewrite: string;
}

// Priority action items
export interface ActionItem {
  priority: "high" | "medium" | "low";
  action: string;
  impact: string;
}

// Contact info detection
export interface ContactInfo {
  has_email: boolean;
  has_phone: boolean;
  has_linkedin: boolean;
  has_github: boolean;
  has_portfolio: boolean;
  issues: string[];
}

// Section detection
export interface SectionDetection {
  sections_found: string[];
  missing_sections: string[];
  section_order_ok: boolean;
}

// Keyword analysis
export interface KeywordAnalysis {
  matched_keywords: string[];
  missing_keywords: string[];
  keyword_density_score: number;
  stuffing_detected: boolean;
}

// Experience quality scoring
export interface ExperienceQuality {
  action_verbs_score: number;
  metrics_score: number;
  relevance_score: number;
  overall_score: number;
  weak_bullets: WeakBullet[];
  generic_phrases: string[];
}

// Formatting check
export interface FormattingCheck {
  ats_friendly: boolean;
  issues: string[];
  page_count_ok: boolean;
}

// Readability check
export interface ReadabilityCheck {
  clarity_score: number;
  grammar_issues: string[];
  length_verdict: "too_short" | "optimal" | "too_long";
}

// Score breakdown
export interface ScoreBreakdown {
  keyword_match: number;
  experience_quality: number;
  formatting: number;
  readability: number;
}

// Final verdict
export interface FinalVerdict {
  ats_score: number;
  hire_probability: "Low" | "Medium" | "High";
  summary: string;
}

// JD Matching (optional)
export interface JDMatchAnalysis {
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  matched_soft_skills: string[];
  missing_soft_skills: string[];
  job_title_match: boolean;
  recommendations: string[];
}

// Role Detection
export interface RoleDetection {
  detected_role: string;
  confidence: number;
  industry: string;
  experience_level: "entry" | "mid" | "senior" | "executive";
  role_specific_keywords: string[];
  missing_role_keywords: string[];
}

// LinkedIn Optimization
export interface LinkedInOptimization {
  headline_suggestion: string;
  summary_suggestion: string;
  skills_to_add: string[];
  profile_tips: string[];
  keyword_optimization: string[];
}

// ATS Incompatible Result (Canva-style PDFs)
export interface ATSIncompatibleResult {
  ats_incompatible: true;
  file_type: string;
  file_name: string;
  reason: string;
  extracted_length: number;
}

// Complete result
export interface AnalysisResult {
  final_verdict: FinalVerdict;
  score_breakdown: ScoreBreakdown;
  contact_info: ContactInfo;
  section_detection: SectionDetection;
  keyword_analysis: KeywordAnalysis;
  experience_quality: ExperienceQuality;
  formatting_check: FormattingCheck;
  readability_check: ReadabilityCheck;
  action_items: ActionItem[];
  jd_match?: JDMatchAnalysis;
  role_detection?: RoleDetection;
  linkedin_optimization?: LinkedInOptimization;
}

// Union type for all possible results
export type ResultData = AnalysisResult | ATSIncompatibleResult;

// Type guard
export function isATSIncompatible(result: ResultData): result is ATSIncompatibleResult {
  return 'ats_incompatible' in result && result.ats_incompatible === true;
}
