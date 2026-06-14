import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is it really free?",
    a: "Yes! You get 2 free resume scans. For more scans and advanced features like job description matching, check out our paid plans.",
  },
  {
    q: "What file formats are supported?",
    a: "We support PDF, DOCX, and DOC files — the most common resume formats used by job seekers and accepted by ATS systems.",
  },
  {
    q: "Is my resume data stored?",
    a: "Your privacy matters. We process your resume for analysis and do not share your data with third parties. You can review our Privacy Policy for full details.",
  },
  {
    q: "How accurate is the ATS score?",
    a: "Our scanner checks for the same formatting issues, keyword gaps, and structural problems that real ATS software flags. While no tool can guarantee a specific outcome, our analysis closely mirrors how major applicant tracking systems parse resumes.",
  },
  {
    q: "Do I need to sign up to use it?",
    a: "You can explore the keyword checker on our homepage without signing up. To run a full ATS scan with detailed feedback, a free account is required.",
  },
  {
    q: "What is an ATS?",
    a: "An Applicant Tracking System (ATS) is software that employers use to filter and rank resumes before a human recruiter ever sees them. Over 75% of large companies use one, which means your resume needs to be ATS-friendly to get noticed.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Everything You <span className="text-gradient">Need to Know</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Quick answers to common questions about ATS scanning
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl px-5 data-[state=open]:border-primary/30 transition-colors"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4 text-sm sm:text-base">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 text-sm sm:text-base leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all frequently asked questions →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
