import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-8">
          <FileQuestion className="w-10 h-10 text-primary" />
        </div>

        {/* 404 */}
        <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
        
        {/* Message */}
        <p className="text-xl text-foreground mb-2">Page not found</p>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Looks like this page got lost in the ATS black hole. Let's get you back on track.
        </p>

        {/* CTA */}
        <Link to="/">
          <Button variant="glow" size="lg" className="gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
