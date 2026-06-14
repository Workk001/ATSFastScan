import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePostHog } from "./usePostHog";

export function usePageTracking() {
  const location = useLocation();
  const { capture } = usePostHog();

  useEffect(() => {
    capture("$pageview", {
      $current_url: window.location.href,
      $pathname: location.pathname,
      $search: location.search,
    });
  }, [location, capture]);
}
