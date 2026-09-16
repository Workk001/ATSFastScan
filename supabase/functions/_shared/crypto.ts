// Constant-time comparison for Edge Functions (finding 4.3).
//
// Rule: never compare a computed HMAC digest with `===`. String comparison
// short-circuits on the first differing character, so the time it takes leaks
// how many leading characters of a supplied signature were correct - a timing
// oracle that can be walked byte by byte to forge a signature without knowing
// the secret.

/** Decode a hex string to bytes. Returns null when the input is not valid hex. */
export function hexToBytes(hex: unknown): Uint8Array | null {
  if (typeof hex !== "string") return null;
  if (hex.length === 0 || hex.length % 2 !== 0) return null;
  if (!/^[0-9a-fA-F]+$/.test(hex)) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

/**
 * Compare two hex digests without short-circuiting on content.
 *
 * The loop visits every byte before returning, so elapsed time depends only on
 * the lengths of the inputs and never on how many leading bytes matched. A
 * length mismatch returns early, which leaks length only - the length of an
 * HMAC-SHA256 digest is public, so that is not sensitive.
 *
 * Both malformed and non-hex inputs return false rather than throwing, so this
 * is safe to use directly on a header value.
 */
export function timingSafeEqualHex(a: unknown, b: unknown): boolean {
  const left = hexToBytes(a);
  const right = hexToBytes(b);
  if (!left || !right) return false;
  if (left.length !== right.length) return false;

  let diff = 0;
  for (let i = 0; i < left.length; i++) {
    diff |= left[i] ^ right[i];
  }
  return diff === 0;
}