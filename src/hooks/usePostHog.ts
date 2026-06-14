import posthog from "posthog-js";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const isEnabled = !!posthogKey;

export function usePostHog() {
  const capture = (eventName: string, properties?: Record<string, any>) => {
    if (isEnabled) {
      posthog.capture(eventName, properties);
    }
  };

  const identify = (distinctId: string, properties?: Record<string, any>) => {
    if (isEnabled) {
      posthog.identify(distinctId, properties);
    }
  };

  const reset = () => {
    if (isEnabled) {
      posthog.reset();
    }
  };

  return { capture, identify, reset, isEnabled };
}

export const useAnalytics = usePostHog;
