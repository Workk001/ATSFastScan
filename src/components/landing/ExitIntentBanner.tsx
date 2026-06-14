import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExitIntentBanner = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("exit_banner_shown")) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        sessionStorage.setItem("exit_banner_shown", "1");
        setShow(true);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => setShow(false), 12000);
    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up-fade">
      <div className="bg-card/95 backdrop-blur-lg border-t-2 border-primary/40 shadow-[0_-4px_24px_rgba(0,0,0,0.2)] px-4 py-4">
        <div className="container mx-auto flex items-center justify-between gap-4 max-w-3xl">
          <div className="flex items-center gap-3 min-w-0">
            <AlertTriangle className="w-5 h-5 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                75% of resumes get rejected by ATS before a human sees them
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                Don't let yours be one of them.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="glow"
              onClick={() => {
                setShow(false);
                navigate("/upload");
              }}
            >
              Check My Resume
            </Button>
            <button
              onClick={() => setShow(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentBanner;
