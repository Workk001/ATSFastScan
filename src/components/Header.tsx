import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import PreloadLink from "@/components/PreloadLink";
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { plan } = useSubscription();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/upload", label: "ATS Checker" },
    { to: "/cover-letter", label: "Cover Letter" },
    { to: "/pricing", label: "Pricing" },
    { to: "/about", label: "About" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/signin");
    } catch {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(15,23,42,0.85)] backdrop-blur-[20px] border-b border-primary/15 shadow-[0_4px_24px_rgba(0,0,0,0.4)] py-3 sm:py-4 animate-header-slide-down">
      <nav className="max-w-[1400px] mx-auto flex justify-between items-center px-4 sm:px-6 md:px-12 gap-4 md:gap-12 relative z-[1]">
        {/* Left - Logo with Animation */}
        <Link to="/" className="flex items-center gap-2 sm:gap-[0.9rem] no-underline">
          <div className="w-8 h-8 sm:w-9 sm:h-9 relative">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(210, 100%, 50%)" />
                  <stop offset="100%" stopColor="hsl(195, 100%, 50%)" />
                </linearGradient>
              </defs>
              {/* Fill layer */}
              <path className="animate-fill-energy" d="M20 4L8 20h8l-4 12 12-16h-8l4-12z" fill="url(#energyGradient)" />
              {/* Stroke animation layer */}
              <path
                className="animate-draw-energy"
                d="M20 4L8 20h8l-4 12 12-16h-8l4-12z"
                stroke="hsl(210, 100%, 50%)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-lg sm:text-[1.35rem] font-extrabold tracking-tight animate-fade-in-logo-text whitespace-nowrap">
            <span className="text-white">ATS </span>
            <span className="bg-gradient-to-br from-[hsl(210,100%,50%)] to-[hsl(195,100%,50%)] bg-clip-text text-transparent">
              FastScan
            </span>
          </span>
        </Link>

        {/* Middle - Nav Links (Desktop) with staggered reveal */}
        <div className="flex-1 hidden lg:flex justify-center">
          <ul className="flex gap-1 xl:gap-2 list-none">
            {navLinks.map((link, index) => (
              <li key={link.to} className={`animate-fade-in-nav-item nav-stagger-${index + 1}`}>
                <PreloadLink
                  to={link.to}
                  className={`nav-link-underline block px-4 xl:px-6 py-2 xl:py-2.5 no-underline font-semibold text-sm rounded-lg transition-all duration-300 whitespace-nowrap ${
                    location.pathname === link.to ? "text-primary active" : "text-[hsl(215,20%,70%)] hover:text-primary"
                  }`}
                >
                  {link.label}
                </PreloadLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right - Auth Button (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 animate-fade-in-auth">
          {user ? (
            <div className="flex items-center gap-3 xl:gap-4">
              {/* Merged user info + plan badge */}
              <Link to="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${
                  plan === "pro" 
                    ? "border-amber-500/30 text-amber-400 bg-amber-500/10" 
                    : plan === "plus" 
                      ? "border-primary/30 text-primary bg-primary/10" 
                      : "border-border/50 text-muted-foreground bg-muted/50"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${plan === "pro" ? "bg-amber-500" : plan === "plus" ? "bg-primary" : "bg-muted-foreground"}`} />
                  {plan === "pro" ? "Pro" : plan === "plus" ? "Plus" : "Free"}
                </span>
                <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0">
                  {(user.displayName || user.email || "U").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className="block max-w-[120px] xl:max-w-[160px] truncate text-sm font-medium text-foreground">
                    {user.displayName || user.email?.split("@")[0] || "User"}
                  </span>
                  {user.email && (
                    <span className="block max-w-[180px] xl:max-w-[220px] truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  )}
                </div>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 xl:gap-2 text-xs xl:text-sm h-8 xl:h-9"
              >
                <LogOut className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign in
              </Link>
              <Link to="/upload">
                <Button variant="glow" size="sm" className="rounded-lg h-9 px-4 text-xs font-bold gap-1.5">
                  Start Free Scan
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[260px] sm:w-[300px] p-0">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border/20">
                <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 relative">
                    <svg className="w-full h-full" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="energyGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(210, 100%, 50%)" />
                          <stop offset="100%" stopColor="hsl(195, 100%, 50%)" />
                        </linearGradient>
                      </defs>
                      <path d="M20 4L8 20h8l-4 12 12-16h-8l4-12z" fill="url(#energyGradientMobile)" />
                    </svg>
                  </div>
                  <span className="text-base sm:text-lg font-extrabold">
                    <span className="text-white">ATS</span>
                    <span className="bg-gradient-to-br from-[hsl(210,100%,50%)] to-[hsl(195,100%,50%)] bg-clip-text text-transparent">
                      FastScan
                    </span>
                  </span>
                </Link>
              </div>

              {/* User Info (Mobile) - Clickable to Dashboard */}
              {user && (
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block p-3 sm:p-4 border-b border-border/20 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        {(user.displayName || user.email || "U").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="block truncate max-w-[120px] font-medium text-foreground text-sm">
                          {user.displayName || user.email?.split("@")[0] || "User"}
                        </span>
                        {user.email && (
                          <span className="block truncate max-w-[140px] text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted/50 border border-border/50">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${plan === "pro" ? "bg-amber-500" : plan === "plus" ? "bg-primary" : "bg-muted-foreground"}`}
                      />
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {plan === "pro" ? "Pro" : plan === "plus" ? "Plus" : "Free"}
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col p-3 sm:p-4 gap-1">
                {navLinks.map((link) => (
                  <PreloadLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                      location.pathname === link.to
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </PreloadLink>
                ))}
              </nav>

              {/* Mobile CTA */}
              <div className="mt-auto p-3 sm:p-4 border-t border-border/20">
                {user ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full rounded-xl font-semibold gap-2 h-10 sm:h-11 text-sm"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/upload" onClick={() => setIsOpen(false)} className="block">
                      <Button variant="glow" className="w-full rounded-xl font-bold gap-2 h-10 sm:h-11 text-sm">
                        Scan My Resume Free
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to="/signin" onClick={() => setIsOpen(false)} className="block text-center text-sm text-muted-foreground hover:text-foreground py-2">
                      Already have an account? Sign in
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Header;
