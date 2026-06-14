import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 sm:pt-28 lg:pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: March 30, 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="bg-card/30 rounded-3xl border border-border/50 p-8 sm:p-10 space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    At ATS FastScan, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                    disclose, and safeguard your information when you use our resume analysis service. Please read this 
                    privacy policy carefully.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    We may collect information about you in a variety of ways including:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li><strong className="text-foreground">Resume Data:</strong> The resume content you upload for analysis</li>
                    <li><strong className="text-foreground">Job Descriptions:</strong> Any job descriptions you provide for matching</li>
                    <li><strong className="text-foreground">Usage Data:</strong> Information about how you interact with our service</li>
                    <li><strong className="text-foreground">Device Information:</strong> Browser type, operating system, and device identifiers</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Analyze your resume and provide ATS compatibility scores</li>
                    <li>Generate personalized recommendations for improvement</li>
                    <li>Improve our algorithms and service quality</li>
                    <li>Respond to your inquiries and support requests</li>
                    <li>Monitor and analyze usage patterns</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Retention</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not permanently store your resume or personal documents on our servers. Resume data is 
                    processed in real-time and is not retained after analysis is complete. Aggregated, anonymized 
                    data may be retained for service improvement purposes.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">5. Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement appropriate technical and organizational security measures to protect your 
                    information. This includes encryption during data transmission and secure processing 
                    environments. However, no method of transmission over the Internet is 100% secure.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">6. Third-Party Services</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may use third-party services for analytics and service functionality. These providers 
                    have their own privacy policies and may collect information as specified in their respective 
                    policies. We do not sell your personal information to third parties.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">7. Your Rights</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Depending on your location, you may have the right to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Access the personal information we hold about you</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Object to processing of your information</li>
                    <li>Request data portability</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">8. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have questions or concerns about this Privacy Policy, please contact us at{" "}
                    <a href="mailto:contact@atsfastscan.com" className="text-primary hover:underline">
                      contact@atsfastscan.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
