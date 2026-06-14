import { Link } from "react-router-dom";
import { AlertTriangle, FileText, FileUp, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ATSIncompatibleResult } from "@/types/analysis";

interface ATSIncompatibleViewProps {
  result: ATSIncompatibleResult;
}

const ATSIncompatibleView = ({ result }: ATSIncompatibleViewProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Main Alert Card */}
      <div className="glass-card rounded-2xl p-8 sm:p-10 text-center animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 border border-warning/20 mb-6">
          <AlertTriangle className="w-8 h-8 text-warning" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          This Resume Isn't ATS-Readable
        </h1>
        
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Your file <span className="font-medium text-foreground">"{result.file_name}"</span> appears 
          to be designed using tools like <span className="font-semibold">Canva, Adobe InDesign,</span> or 
          similar design software.
        </p>

        {/* Why Section */}
        <div className="bg-muted/50 rounded-xl p-6 text-left mb-8">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Why ATS Can't Read This
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-destructive mt-0.5">•</span>
              <span>Design-focused PDFs store text as <strong>images or shapes</strong>, not actual text</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive mt-0.5">•</span>
              <span>Applicant Tracking Systems (ATS) need <strong>machine-readable text</strong> to parse your resume</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive mt-0.5">•</span>
              <span>Your resume may be <strong>automatically rejected</strong> before a human ever sees it</span>
            </li>
          </ul>
        </div>

        {/* Solutions */}
        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-foreground">How to Fix This</h3>
          
          <div className="grid gap-3 text-left">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-success/5 border border-success/20">
              <CheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Upload a DOCX file</p>
                <p className="text-sm text-muted-foreground">Word documents are fully ATS-compatible</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Export PDF from Word or Google Docs</p>
                <p className="text-sm text-muted-foreground">These preserve searchable, machine-readable text</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/upload">
            <Button variant="outline" size="lg" className="gap-2 rounded-xl w-full sm:w-auto">
              <FileUp className="w-4 h-4" />
              Upload Different File
            </Button>
          </Link>
          
          <Link to="/upload">
            <Button variant="glow" size="lg" className="gap-2 rounded-xl w-full sm:w-auto">
              <Sparkles className="w-4 h-4" />
              Fix This Resume for ATS
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Additional Tips */}
      <div className="glass-card rounded-2xl p-6 mt-6 animate-fade-in-up stagger-1">
        <h3 className="font-semibold text-foreground mb-3">Pro Tips for ATS-Friendly Resumes</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">1.</span>
            <span>Use simple, clean layouts with standard fonts (Arial, Calibri, Times New Roman)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">2.</span>
            <span>Avoid text boxes, tables, headers/footers, and graphics</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">3.</span>
            <span>Use standard section headings (Experience, Education, Skills)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">4.</span>
            <span>Save as .docx or export PDF from Word/Google Docs — never from design tools</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ATSIncompatibleView;
