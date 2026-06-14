import { createRoot } from "react-dom/client";
import { AuthProvider } from "@/contexts/AuthContext";
import App from "./App.tsx";
import "./index.css";
import posthog from "posthog-js";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: "https://app.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // Handled manually via React Router
    capture_pageleave: true,
    autocapture: true,
  });
}

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
