import { FileCheck, Mail, Phone, Linkedin, Github, Globe, CheckCircle, XCircle } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";

interface SectionAnalysisProps {
  result: AnalysisResult;
}

const SectionAnalysis = ({ result }: SectionAnalysisProps) => {
  const { contact_info, section_detection } = result;

  const contactItems = [
    { key: "has_email", label: "Email", icon: Mail },
    { key: "has_phone", label: "Phone", icon: Phone },
    { key: "has_linkedin", label: "LinkedIn", icon: Linkedin },
    { key: "has_github", label: "GitHub", icon: Github },
    { key: "has_portfolio", label: "Portfolio", icon: Globe },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
          <FileCheck className="w-5 h-5 text-success" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Sections & Contact</h2>
          <p className="text-sm text-muted-foreground">Resume structure analysis</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Contact Information</h3>
          <div className="space-y-2">
            {contactItems.map((item) => {
              const IconComponent = item.icon;
              const hasItem = contact_info[item.key as keyof typeof contact_info] as boolean;
              return (
                <div key={item.key} className={`flex items-center gap-3 p-2 rounded-lg ${hasItem ? "text-foreground" : "text-muted-foreground"}`}>
                  <IconComponent className={`w-4 h-4 ${hasItem ? "text-success" : "text-muted-foreground"}`} />
                  <span className="text-sm">{item.label}</span>
                  {hasItem ? (
                    <CheckCircle className="w-4 h-4 text-success ml-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive ml-auto" />
                  )}
                </div>
              );
            })}
          </div>
          {contact_info.issues.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm text-warning">{contact_info.issues.join(", ")}</p>
            </div>
          )}
        </div>

        {/* Sections */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Resume Sections</h3>
          
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Found Sections</p>
            <div className="flex flex-wrap gap-2">
              {section_detection.sections_found.map((section, index) => (
                <span key={index} className="px-3 py-1 rounded-full text-sm bg-success/10 text-success border border-success/20 capitalize">
                  {section}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Missing Sections</p>
            <div className="flex flex-wrap gap-2">
              {section_detection.missing_sections.map((section, index) => (
                <span key={index} className="px-3 py-1 rounded-full text-sm bg-destructive/10 text-destructive border border-destructive/20 capitalize">
                  {section}
                </span>
              ))}
            </div>
          </div>

          <div className={`p-3 rounded-lg border ${section_detection.section_order_ok ? "bg-success/10 border-success/20" : "bg-warning/10 border-warning/20"}`}>
            <p className={`text-sm ${section_detection.section_order_ok ? "text-success" : "text-warning"}`}>
              {section_detection.section_order_ok ? "✓ Section order is ATS-friendly" : "⚠ Consider reordering sections for better ATS parsing"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionAnalysis;
