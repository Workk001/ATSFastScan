import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import ScoreCard from "@/components/results/ScoreCard";
import JDMatchSection from "@/components/results/JDMatchSection";
import RoleDetectionSection from "@/components/results/RoleDetectionSection";
import KeywordsList from "@/components/results/KeywordsList";
import ExperienceQuality from "@/components/results/ExperienceQuality";
import SectionAnalysis from "@/components/results/SectionAnalysis";
import FormattingAnalysis from "@/components/results/FormattingAnalysis";
import LinkedInSection from "@/components/results/LinkedInSection";
import ActionItems from "@/components/results/ActionItems";
import PDFExportButton from "@/components/results/PDFExportButton";
import ATSIncompatibleView from "@/components/results/ATSIncompatibleView";
import { Helmet } from "react-helmet-async";

import type { ResultData, ATSIncompatibleResult, AnalysisResult } from "@/types/analysis";

const ResultsPage = () => {
  const [result, setResult] = useState<ResultData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stateResult = (location.state as { analysisResult?: ResultData })?.analysisResult;
    if (stateResult) {
      setResult(stateResult);
    } else {
      navigate("/upload");
    }
  }, [navigate, location.state]);

  if (!result) return null;

  // Check if this is an ATS-incompatible result
  const isIncompatible = 'ats_incompatible' in result && result.ats_incompatible === true;

  if (isIncompatible) {
    return (
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>Results – ATS FastScan</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 mb-8 max-w-2xl mx-auto">
              <Link to="/upload" className="text-muted-foreground hover:text-foreground transition-colors">
                ← Back to upload
              </Link>
            </div>
            <ATSIncompatibleView result={result as ATSIncompatibleResult} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Normal analysis result
  const analysisResult = result as AnalysisResult;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Results – ATS FastScan</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="flex-1 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 sm:mb-12 lg:mb-16">
              <Link to="/upload" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                ← Back to upload
              </Link>
              <div className="flex items-center gap-4">
                <PDFExportButton result={analysisResult} />
                <Link to="/upload">
                  <Button variant="outline" size="lg" className="gap-2 rounded-xl h-12 px-6">
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">New Analysis</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
              {/* Main Column (2/3) */}
              <div className="lg:col-span-2 space-y-8 sm:space-y-10 lg:space-y-12">
                <ScoreCard result={analysisResult} />
                <JDMatchSection result={analysisResult} />
                <RoleDetectionSection result={analysisResult} />
                <KeywordsList result={analysisResult} />
                <ExperienceQuality result={analysisResult} />
                <SectionAnalysis result={analysisResult} />
                <FormattingAnalysis result={analysisResult} />
                <LinkedInSection result={analysisResult} />
              </div>

              {/* Action Items - After main content on mobile/tablet, sticky sidebar on desktop */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24">
                  <ActionItems result={analysisResult} />
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="glass-card rounded-2xl lg:rounded-3xl p-10 sm:p-12 lg:p-16 mt-12 sm:mt-16 lg:mt-20 text-center animate-fade-in-up space-y-6">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">Ready to Improve?</h3>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-[1.7]">
                Make the suggested changes and re-analyze to see your improved score.
              </p>
              <Link to="/upload" className="block sm:inline-block">
                <Button variant="glow" size="lg" className="gap-3 rounded-xl px-12 h-14 sm:h-16 text-base sm:text-lg w-full sm:w-auto">
                  Analyze Updated Resume
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResultsPage;
