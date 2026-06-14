import { Link } from "react-router-dom";
import { Heart, Linkedin } from "lucide-react";

const Footer = () => {
  const productLinks = [
    { label: "ATS Checker", href: "/upload" },
    { label: "Cover Letter", href: "/cover-letter" },
    { label: "Resume Tips", href: "/resume-tips" },
    { label: "FAQ", href: "/faq" },
  ];

  const companyLinks = [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="border-t border-border/30 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 sm:w-9 sm:h-9 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="footerEnergyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(210, 100%, 50%)" />
                      <stop offset="100%" stopColor="hsl(195, 100%, 50%)" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M20 4L8 20h8l-4 12 12-16h-8l4-12z"
                    fill="url(#footerEnergyGradient)"
                  />
                </svg>
              </div>
              <span className="text-base sm:text-lg font-extrabold">
                <span className="text-white">ATS</span>
                <span className="bg-gradient-to-br from-[hsl(210,100%,50%)] to-[hsl(195,100%,50%)] bg-clip-text text-transparent">FastScan</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs leading-[1.7]">
              Get your resume past ATS systems with AI-powered analysis and instant feedback.
            </p>
            <a
              href="https://www.linkedin.com/company/atsfastscan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all duration-300"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>Follow us on LinkedIn</span>
            </a>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">Product</h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-2 sm:col-span-1 space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/30 mt-10 lg:mt-12 pt-6 lg:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            © 2026 ATS FastScan. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
              Made with <Heart className="w-3.5 h-3.5 text-destructive" /> for job seekers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
