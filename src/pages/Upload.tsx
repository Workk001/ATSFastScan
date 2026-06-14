import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, X, AlertCircle, Shield, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { extractDocument, getFileType, fileToBase64 } from "@/lib/documentExtraction";
import { getFirebaseIdToken } from "@/lib/getFirebaseToken";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { ScanLimitModal } from "@/components/ScanLimitModal";
import AuthRequiredDialog from "@/components/AuthRequiredDialog";
import { Skeleton } from "@/components/ui/skeleton";

const UploadPage = () => { 
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    plan, 
    status,
    isLoading: isSubscriptionLoading,
    resumeScansUsed, 
    resumeScansLimit, 
    resumeScansRemaining,
    canScanResume, 
    refreshSubscription 
  } = useSubscription();

  const ACCEPTED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword"
  ];

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const validateFile = (file: File): boolean => {
    const ext = getFileExtension(file.name);
    const isValidType = ACCEPTED_TYPES.includes(file.type) || ext === 'pdf' || ext === 'docx' || ext === 'doc';
    
    if (!isValidType) {
      setError("Please upload a PDF or Word document (.docx)");
      toast({
        title: "Invalid file type",
        description: "Only PDF and Word documents are accepted",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  const analyzeResume = async () => {
    if (!file) return;

    // Check scan limit before starting
    if (!canScanResume()) {
      setShowLimitModal(true);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const detectedFileType = getFileType(file);
    
    try {
      let requestBody: Record<string, unknown>;

      // SEPARATE PIPELINES: DOCX = client-side extraction + strict validation, PDF = server-only + relaxed
      if (detectedFileType === 'docx') {
        // ===== DOCX PIPELINE (UNCHANGED - STRICT) =====
        setAnalysisStep("Extracting text from document...");
        const extraction = await extractDocument(file);

        // DOCX: Strict validation - require 200+ chars
        const MIN_TEXT_LENGTH = 200;
        if (extraction.text.length < MIN_TEXT_LENGTH) {
          const errorMsg = `Extracted text too short (${extraction.text.length} chars). This file is not ATS-readable.`;
          console.error('[Resume] DOCX STOPPED: ' + errorMsg);
          throw new Error(errorMsg);
        }

        if (!extraction.success) {
          throw new Error(extraction.error || "Failed to extract text from DOCX.");
        }

        requestBody = { 
          resumeText: extraction.text,
          fileName: file.name,
          fileType: 'docx'
        };
        if (import.meta.env.DEV) {
          console.log(`[Resume] DOCX: Using client-side extracted text (${extraction.text.length} chars)`);
        }
        
      } else if (detectedFileType === 'pdf') {
        // ===== PDF PIPELINE (REBUILT - RELAXED) =====
        // Skip all client-side extraction - send directly to server
        setAnalysisStep("Uploading PDF for analysis...");
        
        const pdfBase64 = await fileToBase64(file);
        
        requestBody = { 
          pdfBase64: pdfBase64,
          fileName: file.name,
          fileType: 'pdf'
        };
        if (import.meta.env.DEV) {
          console.log('[Resume] PDF: Sending to server (no client-side extraction)');
        }
        
      } else {
        throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
      }

      setAnalysisStep("Analyzing with AI...");
      
      // Check auth — show dialog if not signed in
      if (!user) {
        setIsAnalyzing(false);
        setAnalysisStep("");
        setShowAuthModal(true);
        return;
      }

      // Get Firebase auth token
      const authToken = await getFirebaseIdToken();
      if (!authToken) {
        throw new Error("Authentication error. Please try signing in again.");
      }

      const response = await supabase.functions.invoke("analyze-resume", {
        body: requestBody,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      // Access server data explicitly (do NOT destructure immediately)
      const serverData = response?.data;
      const fnError = response?.error;
      
      // ===== RESPONSE HANDLING - SPLIT BY FILE TYPE =====
      
      if (detectedFileType === 'pdf') {
        // PDF PIPELINE: ALWAYS navigate to /results, never throw
        if (import.meta.env.DEV) {
          console.log("[Resume] PDF response processing...");
        }
        
        if (fnError) {
          console.warn("[Resume] PDF function error - showing results anyway:", fnError);
          const incompatibleResult = {
            ats_incompatible: true,
            file_type: 'pdf',
            file_name: file.name,
            reason: fnError.message || "PDF analysis encountered an issue",
            debug: null
          };
          navigate("/results", { state: { analysisResult: incompatibleResult } });
          return;
        }
        
        // Check for server-side errors (extraction failures, etc.)
        if (serverData?.error || serverData?.code === 'UNREADABLE_TEXT' || serverData?.code === 'TEXT_EXTRACTION_FAILED') {
          console.warn("[Resume] PDF extraction issue - showing ATS-incompatible view");
          const incompatibleResult = {
            ats_incompatible: true,
            file_type: 'pdf',
            file_name: file.name,
            reason: serverData.error || "This PDF could not be parsed for ATS analysis",
            extracted_length: serverData.extractedLength || 0,
            debug: serverData._debug || null
          };
          navigate("/results", { state: { analysisResult: incompatibleResult } });
          return;
        }
        
        // Check for valid analysis result
        const rawScore = serverData?.final_verdict?.ats_score;
        const atsScore = typeof rawScore === 'number' ? rawScore : Number(rawScore);
        
        if (!serverData || !serverData.final_verdict || isNaN(atsScore)) {
          // PDF with no valid score - show as low-quality result, NOT error
          console.warn("[Resume] PDF missing valid score - showing ATS-incompatible view");
          const incompatibleResult = {
            ats_incompatible: true,
            file_type: 'pdf',
            file_name: file.name,
            reason: "Could not extract readable text for ATS scoring",
            debug: serverData?._debug || null
          };
          navigate("/results", { state: { analysisResult: incompatibleResult } });
          return;
        }
        
        // PDF SUCCESS: Valid analysis received
        serverData.final_verdict.ats_score = atsScore;
        if (import.meta.env.DEV) {
          console.log("[Resume] PDF analysis complete, ATS score:", atsScore);
        }
        navigate("/results", { state: { analysisResult: serverData } });
        return;
        
      } else {
        // DOCX PIPELINE: Strict validation (unchanged)
        if (fnError) {
          console.error("[Resume] DOCX function error:", fnError);
          throw new Error(fnError.message || "Failed to analyze resume");
        }
        
        if (serverData?.error) {
          console.error("[Resume] DOCX data error:", serverData.error);
          throw new Error(serverData.error);
        }
        
        const rawScore = serverData?.final_verdict?.ats_score;
        const atsScore = typeof rawScore === 'number' ? rawScore : Number(rawScore);
        
        if (!serverData || !serverData.final_verdict || isNaN(atsScore)) {
          console.error("[Resume] DOCX invalid data:", serverData);
          throw new Error("Invalid response from analysis service");
        }
        
        serverData.final_verdict.ats_score = atsScore;
      }

      // Check for scan limit exceeded
      if (serverData?.code === 'SCAN_LIMIT_EXCEEDED' || serverData?.requiresUpgrade) {
        setShowLimitModal(true);
        return;
      }

      if (import.meta.env.DEV) {
        console.log("[Resume] DOCX analysis complete, ATS score:", serverData.final_verdict.ats_score);
      }
      
      // Refresh subscription to update counts
      await refreshSubscription();
      
      navigate("/results", { state: { analysisResult: serverData } });
    } catch (err) {
      console.error("[Resume] Analysis error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze resume. Please try again.";
      setError(errorMessage);
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep("");
    }
  };

  // Show loading skeleton while subscription is loading
  if (isSubscriptionLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg lg:max-w-xl mx-auto">
              <div className="text-center mb-8 sm:mb-10 space-y-4">
                <Skeleton className="h-8 w-48 mx-auto rounded-full" />
                <Skeleton className="h-10 w-64 mx-auto" />
                <Skeleton className="h-5 w-80 mx-auto" />
              </div>
              <div className="glass-card rounded-xl sm:rounded-2xl p-5 sm:p-8">
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg lg:max-w-xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-10 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm text-primary animate-fade-in-up opacity-0">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="font-medium">AI-Powered Analysis</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-foreground animate-fade-in-up opacity-0 stagger-1">
                Check Your Resume
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto animate-fade-in-up opacity-0 stagger-2 leading-[1.7]">
                Upload your resume and get instant AI-powered feedback.
              </p>
            </div>

            {/* Upload card */}
            <div className="glass-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-5 sm:p-8 lg:p-10 animate-fade-in-up opacity-0 stagger-3">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center transition-all duration-300
                  ${isDragging 
                    ? "border-primary bg-primary/5 scale-[1.02]" 
                    : file 
                      ? "border-success/50 bg-success/5" 
                      : error 
                        ? "border-destructive/50 bg-destructive/5" 
                        : "border-border hover:border-primary/50 hover:bg-primary/5"
                  }
                `}
              >
                {isAnalyzing ? (
                  <div className="flex flex-col items-center gap-4 py-6 sm:py-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse" />
                      {/* Rotating ring */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                        <svg className="w-full h-full" viewBox="0 0 80 80" style={{ animation: 'spin 1.5s linear infinite' }}>
                          <circle
                            cx="40"
                            cy="40"
                            r="35"
                            fill="none"
                            stroke="hsl(var(--primary) / 0.2)"
                            strokeWidth="4"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="35"
                            fill="none"
                            stroke="url(#spinner-gradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray="164"
                            strokeDashoffset="120"
                          />
                          <defs>
                            <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="hsl(var(--primary))" />
                              <stop offset="100%" stopColor="hsl(195, 100%, 50%)" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-lg sm:text-xl font-bold text-foreground">Analyzing Your Resume</p>
                      <p className="text-sm sm:text-base text-primary font-medium animate-pulse">{analysisStep || "Processing..."}</p>
                      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>~30 seconds remaining</span>
                      </div>
                    </div>
                  </div>
                ) : file ? (
                  <div className="flex flex-col items-center gap-3 py-2 sm:py-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                    </div>
                    <div className="space-y-1 text-center">
                      <p className="text-sm sm:text-base font-semibold text-foreground break-all px-2">{file.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-muted-foreground hover:text-destructive gap-1.5 h-8 text-xs sm:text-sm"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove
                    </Button>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center gap-3 py-2 sm:py-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
                    </div>
                    <div className="space-y-1 text-center">
                      <p className="text-sm sm:text-base font-semibold text-destructive">{error}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Try again with a valid file</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-3 py-2 sm:py-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <div className="space-y-1.5 text-center">
                        <p className="text-sm sm:text-base font-semibold text-foreground">
                          Drop your resume here
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          or click to browse • PDF or DOCX
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>


              {/* Analyze button */}
              {file && !isAnalyzing && (
                <div className="mt-5 sm:mt-6">
                  <Button
                    variant="glow"
                    size="lg"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      analyzeResume();
                    }}
                    disabled={isAnalyzing}
                    className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold rounded-xl gap-2"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Analyze My Resume
                  </Button>
                </div>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 animate-fade-in-up opacity-0 stagger-4">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span>Privacy protected</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span>30 sec results</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                {plan === 'pro' && status === 'active' ? (
                  <>
                    <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                    <span>Unlimited scans</span>
                  </>
                ) : resumeScansRemaining !== null ? (
                  <>
                    <CheckCircle className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${resumeScansRemaining > 0 ? 'text-success' : 'text-destructive'}`} />
                    <span className={resumeScansRemaining === 0 ? 'text-destructive' : ''}>
                      {resumeScansRemaining} scans left
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Scan Limit Modal */}
      <ScanLimitModal
        open={showLimitModal}
        onOpenChange={setShowLimitModal}
        scanType="resume"
        currentPlan={plan}
        used={resumeScansUsed}
        limit={resumeScansLimit ?? 0}
      />

      {/* Auth Required Dialog */}
      <AuthRequiredDialog
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSuccess={() => analyzeResume()}
        message="Sign in to analyze your resume — it takes 2 seconds."
      />
    </div>
  );
};

export default UploadPage;
