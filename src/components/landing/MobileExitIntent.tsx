import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Mobile exit-intent: triggers after 15s of inactivity (no scroll/touch)
 * on mobile devices. Desktop uses the existing mouseleave-based ExitIntentBanner.
 */
const MobileExitIntent = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only run on touch devices
    if (!("ontouchstart" in window)) return;
    if (sessionStorage.getItem("mobile_exit_shown")) return;

    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        sessionStorage.setItem("mobile_exit_shown", "1");
        setShow(true);
      }, 20000); // 20s idle
    };

    resetTimer();
    window.addEventListener("scroll", resetTimer, { passive: true });
    window.addEventListener("touchstart", resetTimer, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, []);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => setShow(false), 10000);
    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up-fade sm:hidden">
      <div className="bg-card/95 backdrop-blur-lg border-t-2 border-primary/40 shadow-[0_-4px_24px_rgba(0,0,0,0.3)] px-4 py-3">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertTriangle className="w-4 h-4 text-primary shrink-0" />
            <p className="text-xs font-semibold text-foreground leading-tight">
              75% of resumes get auto-rejected. Check yours free.
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              size="sm"
              variant="glow"
              className="h-8 text-xs px-3"
              onClick={() => { setShow(false); navigate("/upload"); }}
            >
              Scan Now
            </Button>
            <button onClick={() => setShow(false)} className="text-muted-foreground p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileExitIntent;
