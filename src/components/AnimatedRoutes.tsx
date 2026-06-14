import { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageTransition from "@/components/PageTransition";
import RouteLoadingFallback from "@/components/RouteLoadingFallback";
import { routes } from "@/lib/routePreload";

const R = routes;

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<RouteLoadingFallback />} key={location.pathname}>
      <PageTransition>
        <Routes location={location}>
          <Route path="/" element={<R.Index.Component />} />
          <Route path="/auth" element={<R.Auth.Component />} />
          <Route path="/signin" element={<R.SignIn.Component />} />
          <Route path="/signup" element={<R.SignUp.Component />} />
          <Route path="/pricing" element={<R.Pricing.Component />} />
          <Route path="/dashboard" element={<ProtectedRoute><R.Dashboard.Component /></ProtectedRoute>} />
          <Route path="/upload" element={<R.Upload.Component />} />
          <Route path="/results" element={<ProtectedRoute><R.Results.Component /></ProtectedRoute>} />
          <Route path="/cover-letter" element={<ProtectedRoute><R.CoverLetter.Component /></ProtectedRoute>} />
          <Route path="/cover-letter/results" element={<ProtectedRoute><R.CoverLetterResults.Component /></ProtectedRoute>} />
          <Route path="/about" element={<R.About.Component />} />
          <Route path="/contact" element={<R.Contact.Component />} />
          <Route path="/resume-tips" element={<R.ResumeTips.Component />} />
          <Route path="/faq" element={<R.FAQ.Component />} />
          <Route path="/blog" element={<R.Blog.Component />} />
          <Route path="/privacy" element={<R.Privacy.Component />} />
          <Route path="/terms" element={<R.Terms.Component />} />
          <Route path="*" element={<R.NotFound.Component />} />
        </Routes>
      </PageTransition>
    </Suspense>
  );
};

export default AnimatedRoutes;
