import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { AnalysisResult } from "@/types/analysis";

interface PDFExportButtonProps {
  result: AnalysisResult;
}

const PDFExportButton = ({ result }: PDFExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const generatePDF = async () => {
    setIsExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;

      // Helper functions
      const addText = (text: string, size: number, style: "normal" | "bold" = "normal", color: [number, number, number] = [0, 0, 0]) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", style);
        doc.setTextColor(color[0], color[1], color[2]);
        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, margin, yPos);
        yPos += lines.length * (size * 0.5) + 4;
      };

      const checkNewPage = (height: number = 30) => {
        if (yPos + height > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          yPos = 20;
        }
      };

      const addSection = (title: string) => {
        checkNewPage(40);
        yPos += 8;
        addText(title, 14, "bold", [59, 130, 246]);
        yPos += 2;
      };

      // Header
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, pageWidth, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("Resume Analysis Report", margin, 28);
      yPos = 55;

      // Score Overview
      const score = result.final_verdict.ats_score;
      const scoreColor: [number, number, number] = score >= 80 ? [34, 197, 94] : score >= 50 ? [234, 179, 8] : [239, 68, 68];
      addText(`ATS Score: ${score}/100`, 20, "bold", scoreColor);
      addText(`Hire Probability: ${result.final_verdict.hire_probability}`, 14, "normal", [100, 100, 100]);
      yPos += 5;

      // Summary
      addText(result.final_verdict.summary, 11, "normal");
      yPos += 5;

      // Score Breakdown
      addSection("Score Breakdown");
      addText(`Keywords: ${result.score_breakdown.keyword_match}%`, 10);
      addText(`Experience: ${result.score_breakdown.experience_quality}%`, 10);
      addText(`Formatting: ${result.score_breakdown.formatting}%`, 10);
      addText(`Readability: ${result.score_breakdown.readability}%`, 10);

      // Keyword Analysis
      addSection("Keyword Analysis");
      addText(`Density Score: ${result.keyword_analysis.keyword_density_score}%`, 11, "bold");
      
      if (result.keyword_analysis.matched_keywords.length > 0) {
        addText("Matched Keywords:", 10, "bold");
        addText(result.keyword_analysis.matched_keywords.join(", "), 10);
      }

      if (result.keyword_analysis.missing_keywords.length > 0) {
        addText("Missing Keywords:", 10, "bold");
        addText(result.keyword_analysis.missing_keywords.join(", "), 10);
      }

      // Formatting Issues
      if (result.formatting_check.issues.length > 0) {
        addSection("Formatting Issues");
        result.formatting_check.issues.forEach(issue => {
          checkNewPage();
          addText(`• ${issue}`, 10);
        });
      }

      // Job Match (if available)
      if (result.jd_match) {
        addSection("Job Description Match");
        addText(`Match Score: ${result.jd_match.match_percentage}%`, 11, "bold");
        
        if (result.jd_match.matched_skills.length > 0) {
          addText("Matched Skills:", 10, "bold");
          addText(result.jd_match.matched_skills.join(", "), 10);
        }
        
        if (result.jd_match.missing_skills.length > 0) {
          addText("Missing Skills:", 10, "bold");
          addText(result.jd_match.missing_skills.join(", "), 10);
        }
      }

      // Content Improvements
      if (result.experience_quality.weak_bullets.length > 0) {
        addSection("Content Improvements");
        result.experience_quality.weak_bullets.slice(0, 3).forEach((bullet, i) => {
          checkNewPage(50);
          addText(`Suggestion ${i + 1}:`, 10, "bold");
          addText(`Original: ${bullet.original}`, 9, "normal", [150, 150, 150]);
          addText(`Issue: ${bullet.issue}`, 9);
          addText(`Rewrite: ${bullet.rewrite}`, 9, "normal", [34, 197, 94]);
          yPos += 4;
        });
      }

      // Action Items
      addSection("Action Items");
      result.action_items.forEach((item) => {
        checkNewPage();
        const priorityColor: [number, number, number] = 
          item.priority === "high" ? [239, 68, 68] : 
          item.priority === "medium" ? [234, 179, 8] : [100, 100, 100];
        addText(`[${item.priority.toUpperCase()}] ${item.action}`, 10, "bold", priorityColor);
        addText(`Impact: ${item.impact}`, 9, "normal", [100, 100, 100]);
        yPos += 2;
      });

      // Footer
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Generated by ResumeAI • Page ${i} of ${pageCount} • ${new Date().toLocaleDateString()}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      doc.save(`resume-analysis-${Date.now()}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={generatePDF}
      disabled={isExporting}
      variant="outline"
      size="default"
      className="gap-2 rounded-xl"
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {isExporting ? "Exporting..." : "Export PDF"}
    </Button>
  );
};

export default PDFExportButton;
