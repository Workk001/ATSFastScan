import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 sm:pt-28 lg:pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: March 30, 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card/30 rounded-3xl border border-border/50 p-8 sm:p-10 space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using ATS FastScan, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our service. We reserve the right 
                  to modify these terms at any time, and your continued use constitutes acceptance of any changes.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ATS FastScan provides AI-powered resume analysis to help users optimize their resumes for 
                  Applicant Tracking Systems. Our service analyzes resume content and provides scores, 
                  recommendations, and insights to improve ATS compatibility.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  As a user of our service, you agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide accurate information in your resume uploads</li>
                  <li>Use the service only for lawful purposes</li>
                  <li>Not attempt to reverse engineer or compromise the service</li>
                  <li>Not use the service to process resumes that you do not have permission to analyze</li>
                  <li>Not use automated systems to access the service without permission</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content, features, and functionality of ATS FastScan, including but not limited to 
                  text, graphics, logos, and software, are owned by us and protected by intellectual property 
                  laws. You may not copy, modify, or distribute our content without prior written consent.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our service is provided "as is" without warranties of any kind. We do not guarantee that 
                  using our service will result in job interviews or employment. ATS scores and recommendations 
                  are based on our analysis algorithms and may not reflect the exact criteria used by all 
                  employer ATS systems.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the fullest extent permitted by law, ATS FastScan shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages resulting from your use of or 
                  inability to use the service, including any damages related to job applications or employment outcomes.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Service Modifications</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify, suspend, or discontinue any part of our service at any time 
                  without prior notice. We are not liable to you or any third party for any modification, 
                  suspension, or discontinuation of the service.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">8. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with applicable laws, without 
                  regard to conflict of law principles. Any disputes arising from these terms shall be resolved 
                  through appropriate legal channels.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">9. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms of Service, please contact us at{" "}
                    <a href="mailto:contact@atsfastscan.com" className="text-primary hover:underline">
                    contact@atsfastscan.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
