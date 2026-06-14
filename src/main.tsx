import { createRoot } from "react-dom/client";
import { AuthProvider } from "@/contexts/AuthContext";
import App from "./App.tsx";
import "./index.css";
import posthog from "posthog-js";
import { HelmetProvider } from "react-helmet-async";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
if (posthogKey) {
  // Defer PostHog until after critical rendering path
  setTimeout(() => {
    posthog.init(posthogKey, {
      api_host: "https://app.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
      
      // Disable unused features to reduce network load
      disable_surveys: true,
      enable_recording_console_log: false,
      __preview_send_client_session_params: false,
      capture_dead_clicks: false,
      capture_performance: false,
      disable_session_recording: false,
      loaded: (ph) => {
        if (import.meta.env.DEV) {
          ph.debug();
        }
      },
    });
  }, 1000); // 1 second delay — page is rendered by then
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </HelmetProvider>
);
