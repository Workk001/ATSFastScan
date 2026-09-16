// Server-side PostHog client for edge functions.
//
// Instrumentation only: every helper here is best-effort and never throws into the
// caller, so a PostHog outage can never block a scan or a payment webhook. Each call
// is bounded by a short timeout because edge functions are short-lived and must not
// hang waiting on analytics.

type CaptureArgs = {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
};

interface ServerPostHogClient {
  capture: (args: CaptureArgs) => void;
  captureImmediate?: (args: CaptureArgs) => Promise<void> | void;
  captureException?: (
    error: unknown,
    distinctId?: string,
    additionalProperties?: Record<string, unknown>
  ) => void;
  flush?: () => Promise<void>;
}

const DEFAULT_HOST = "https://us.i.posthog.com";
const FLUSH_TIMEOUT_MS = 1500;

let clientPromise: Promise<ServerPostHogClient | null> | null = null;

async function loadClient(): Promise<ServerPostHogClient | null> {
  const key = Deno.env.get("POSTHOG_KEY");
  if (!key) {
    console.log("[PostHog] POSTHOG_KEY not configured; server events disabled");
    return null;
  }

  try {
    // Dynamic import so a failed dependency load cannot break the function.
    const mod = (await import("npm:posthog-node@4")) as {
      PostHog?: new (key: string, options?: Record<string, unknown>) => ServerPostHogClient;
      default?: new (key: string, options?: Record<string, unknown>) => ServerPostHogClient;
    };
    const PostHog = mod.PostHog ?? mod.default;
    if (!PostHog) {
      console.warn("[PostHog] posthog-node did not export a PostHog constructor");
      return null;
    }

    return new PostHog(key, {
      host: Deno.env.get("POSTHOG_HOST") || DEFAULT_HOST,
      flushAt: 1,
      flushInterval: 0,
      disableGeoip: true,
    });
  } catch (error) {
    console.warn("[PostHog] Server client init failed:", error);
    return null;
  }
}

function getClient(): Promise<ServerPostHogClient | null> {
  if (!clientPromise) {
    clientPromise = loadClient();
  }
  return clientPromise;
}

function withTimeout(promise: Promise<unknown>): Promise<unknown> {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(resolve, FLUSH_TIMEOUT_MS)),
  ]);
}

async function send(client: ServerPostHogClient, args: CaptureArgs): Promise<void> {
  // captureImmediate (posthog-node v4+) awaits a single delivery; older builds fall
  // back to capture() followed by flush().
  if (typeof client.captureImmediate === "function") {
    await withTimeout(Promise.resolve(client.captureImmediate(args)));
    return;
  }

  client.capture(args);
  if (typeof client.flush === "function") {
    await withTimeout(client.flush());
  }
}

/**
 * Fire a server-side event. Never throws, and never blocks longer than
 * FLUSH_TIMEOUT_MS, so callers can safely await it on an error path.
 */
export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties: Record<string, unknown> = {}
): Promise<void> {
  try {
    const client = await getClient();
    if (!client) return;
    await send(client, { distinctId, event, properties });
  } catch (error) {
    console.warn("[PostHog] captureServerEvent failed:", error);
  }
}

/**
 * Report an exception to PostHog error tracking. Never throws.
 * The distinct id ties the report to the same person the browser identified.
 */
export async function captureServerException(
  distinctId: string,
  error: unknown,
  properties: Record<string, unknown> = {}
): Promise<void> {
  try {
    const client = await getClient();
    if (!client) return;

    // Normalise non-Error throwables so message and stack are still captured.
    const err = error instanceof Error ? error : new Error(String(error));

    if (typeof client.captureException === "function") {
      client.captureException(err, distinctId, properties);
      if (typeof client.flush === "function") {
        await withTimeout(client.flush());
      }
      return;
    }

    // Fallback for builds without captureException(): emit a $exception event using
    // the property names PostHog error tracking understands.
    await send(client, {
      distinctId,
      event: "$exception",
      properties: {
        ...properties,
        $exception_level: "error",
        $exception_type: err.name,
        $exception_message: err.message,
        $exception_stack_trace_raw: err.stack ?? null,
      },
    });
  } catch (captureError) {
    console.warn("[PostHog] captureServerException failed:", captureError);
  }
}
