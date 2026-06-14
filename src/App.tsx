import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Header from "@/components/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SpaceGrid } from "@/components/SpaceGrid";
import AnimatedRoutes from "@/components/AnimatedRoutes";

const queryClient = new QueryClient();

import { usePageTracking } from "@/hooks/usePageTracking";

const PageTracker = () => {
  usePageTracking();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTracker />
        <SpaceGrid />
        <ScrollToTop />
        <Header />
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
