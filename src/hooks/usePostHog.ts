import posthog from "posthog-js";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const isEnabled = !!posthogKey;

type PersonPropertyValue = string | number | boolean | null;

/** Person properties are JSON-serializable values sent to PostHog as a $set. */
export type PersonProperties = Record<string, PersonPropertyValue>;

// Person-property payloads already sent, so repeated subscription fetches do not
// resend an identical $set. Keyed by distinct id + payload signature, which means a
// logout/login (new distinct id) or a plan change (new signature) does resend.
const sentPersonProps = new Set<string>();

function safeDistinctId(): string | null {
  try {
    return posthog.get_distinct_id() ?? null;
  } catch {
    return null;
  }
}

/**
 * Attach durable person properties (plan_type, signup_date, ...).
 * Best-effort: analytics must never break the caller, so failures are swallowed.
 * Pass dedupeKey to skip resending the same payload for the same person.
 */
export function setPersonProperties(
  properties: PersonProperties,
  dedupeKey?: string
): void {
  if (!isEnabled) return;

  try {
    if (dedupeKey) {
      const key = `${safeDistinctId() ?? "anonymous"}:${dedupeKey}`;
      if (sentPersonProps.has(key)) return;
      sentPersonProps.add(key);
    }

    posthog.people.set(properties);
  } catch {
    // Instrumentation only - never surface analytics failures to the caller.
  }
}

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

  return { capture, identify, reset, setPersonProperties, isEnabled };
}

export const useAnalytics = usePostHog;
