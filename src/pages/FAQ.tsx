import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "What is an ATS (Applicant Tracking System)?",
      answer: "An Applicant Tracking System (ATS) is software used by employers to collect, sort, scan, and rank job applications. Over 90% of large companies use ATS to filter resumes before a human ever sees them. Our tool helps you optimize your resume to pass these automated screenings."
    },
    {
      question: "How does ATS FastScan work?",
      answer: "Simply upload your resume and optionally paste the job description you're applying for. Our AI-powered system analyzes your resume against common ATS criteria including keyword optimization, formatting, structure, and readability. You'll receive an instant score along with specific, actionable recommendations to improve your resume."
    },
    {
      question: "What file formats do you support?",
      answer: "We support PDF and DOCX (Microsoft Word) file formats. These are the most commonly accepted formats by employers and ATS systems. For best results, we recommend using PDF as it preserves your formatting across different devices."
    },
    {
      question: "Is my resume data secure?",
      answer: "Yes, we take your privacy seriously. Your resume is processed securely and is not stored permanently on our servers. We use industry-standard encryption to protect your data during analysis. We never share your information with third parties."
    },
    {
      question: "What is a good ATS score?",
      answer: "A score of 80 or above is generally considered good and indicates your resume is well-optimized for ATS systems. Scores between 60-79 suggest room for improvement, while scores below 60 indicate significant optimization is needed. Remember, our recommendations can help you improve any score."
    },
    {
      question: "Do I need to include a job description?",
      answer: "While not required, including the job description significantly improves the accuracy of our analysis. It allows us to check for specific keywords and requirements that the employer's ATS will be looking for, giving you tailored recommendations for that specific role."
    },
    {
      question: "How often should I update my resume?",
      answer: "We recommend updating your resume every time you apply for a new position to ensure it's optimized for that specific job description. At minimum, update it every 3-6 months to add new skills, achievements, and experiences."
    },
    {
      question: "Can ATS FastScan guarantee I'll get an interview?",
      answer: "While we can't guarantee interview invitations (no tool can), optimizing your resume with ATS FastScan significantly increases your chances of getting past automated screenings. A higher ATS score means your resume is more likely to reach human recruiters."
    },
    {
      question: "Is the service free?",
      answer: "Yes, you can use ATS FastScan for free with 2 resume scans on the free plan. If you need more scans and advanced features, you can upgrade to a paid plan."
    },
    {
      question: "What makes a resume ATS-friendly?",
      answer: "An ATS-friendly resume uses standard fonts, simple formatting without tables or graphics, clear section headings, relevant keywords from the job description, and a logical structure. Our tool analyzes all these factors and provides specific recommendations."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              FAQ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-6 leading-tight">
              Frequently Asked{" "}
              <span className="text-primary">Questions</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Got questions? We've got answers. Find everything you need to know 
              about ATS optimization and our tool.
            </p>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card/30 rounded-xl sm:rounded-2xl border border-border/50 px-4 sm:px-6 data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-4 sm:py-5 text-sm sm:text-base">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 sm:pb-5 pl-6 sm:pl-8 text-xs sm:text-sm leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Still have questions */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-16">
          <div className="max-w-2xl mx-auto text-center bg-card/30 rounded-2xl sm:rounded-3xl border border-border/50 p-5 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">
              Still have questions?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
              Can't find the answer you're looking for? We're here to help.
            </p>
            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
