import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 sm:hidden animate-slide-up-fade">
      <Link to="/upload" className="w-full max-w-sm">
        <Button
          variant="glow"
          size="lg"
          className="w-full rounded-xl h-12 text-sm font-bold shadow-[0_4px_24px_rgba(0,0,0,0.4)] gap-2"
        >
          Scan My Resume Free
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};

export default FloatingCTA;
