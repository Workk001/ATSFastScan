// Prompt-injection defence for untrusted document text (findings 5.1, 5.7).
//
// This REPLACES the two byte-identical copies that lived in analyze-resume and
// analyze-cover-letter. Best-effort by design: a blocklist cannot be complete,
// so nothing downstream may treat its output as trusted.
//
// Two properties make this work, and both matter:
//
//   1. Obfuscation is normalised BEFORE matching. The old version matched the
//      raw text, so `ignore<ZWSP>previous<ZWSP>instructions` slipped through -
//      \s does not match U+200B, and neither do U+200D, U+2060 or U+00AD.
//      Homoglyphs (Cyrillic i/o/e) and separator swaps (`ignore-previous`,
//      `ignore. previous`) slipped through the same way.
//
//   2. Folding must NOT corrupt the document we send to the model. Rewriting a
//      Cyrillic name into Latin nonsense would be a real regression, so this
//      detects on a folded COPY and redacts the ORIGINAL. That is only sound
//      because folding is strictly 1:1 in UTF-16 code units and matching uses
//      the case-insensitive flag rather than lowercasing (String.toLowerCase
//      can change length, e.g. U+0130 becomes two characters, which would
//      silently misalign every offset after it).

/** Number of characters of untrusted text that survive sanitisation. */
export const MAX_UNTRUSTED_TEXT_LENGTH = 15000;

const FORMAT_CHAR = /\p{Cf}/u;
const FULLWIDTH_START = 0xff01;
const FULLWIDTH_END = 0xff5e;
const FULLWIDTH_OFFSET = 0xfee0;

// ASCII look-alikes and leetspeak substitutions. Every value is exactly one
// UTF-16 code unit, which is what keeps folding index-compatible with the input.
const FOLD_MAP: Record<string, string> = {
  // Cyrillic
  "\u0430": "a", "\u0435": "e", "\u043e": "o", "\u0440": "p", "\u0441": "c",
  "\u0443": "y", "\u0456": "i", "\u0458": "j", "\u0455": "s", "\u0445": "x",
  "\u043a": "k", "\u043c": "m", "\u043d": "h", "\u0442": "t", "\u0432": "b",
  "\u0410": "A", "\u0415": "E", "\u041e": "O", "\u0420": "P", "\u0421": "C",
  "\u0423": "Y", "\u0406": "I", "\u041a": "K", "\u041c": "M", "\u041d": "H",
  "\u0422": "T", "\u0412": "B", "\u0425": "X",
  // Greek
  "\u03b1": "a", "\u03bf": "o", "\u03bd": "v", "\u03c1": "p", "\u03b5": "e",
  "\u0391": "A", "\u039f": "O", "\u039d": "N", "\u03a1": "P", "\u0395": "E",
  // Leetspeak
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b",
  "@": "a", "$": "s", "!": "i", "|": "i",
};

/**
 * Fold text to an ASCII-confusable probe copy.
 *
 * Guarantees the output has exactly the same UTF-16 length as the input:
 * iterating by code unit keeps surrogate pairs intact, format characters map to
 * a single space, full-width forms map to a single ASCII character, and
 * everything else passes through unchanged.
 */
export function foldForMatching(text: string): string {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (FORMAT_CHAR.test(ch)) {
      // Zero-width and bidi controls become a space so they cannot be used to
      // split a phrase apart.
      out += " ";
      continue;
    }
    const code = ch.charCodeAt(0);
    if (code >= FULLWIDTH_START && code <= FULLWIDTH_END) {
      out += String.fromCharCode(code - FULLWIDTH_OFFSET);
      continue;
    }
    const mapped = FOLD_MAP[ch];
    out += mapped !== undefined ? mapped : ch;
  }
  return out;
}

// Separator between words of a trigger phrase. `\s+` inside the class covers
// runs of spaces and newlines; the punctuation covers `ignore-previous`,
// `ignore.previous`, `ignore_previous`.
const SEP = "[\\s\\-_.*|/**+~]+";

function phrasePattern(phrase: string): RegExp {
  const words = phrase.split(" ").map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  // `i` rather than lowercasing, so offsets stay aligned with the source.
  return new RegExp(`\\b${words.join(SEP)}`, "gi");
}

// Synonyms are included because the audit found "disregard all previous
// instructions" reaching the model completely untouched.
const TRIGGER_PHRASES = [
  "ignore all previous instructions",
  "ignore all prior instructions",
  "ignore previous instructions",
  "ignore prior instructions",
  "ignore above instructions",
  "ignore all instructions",
  "disregard all previous instructions",
  "disregard previous instructions",
  "disregard all prior instructions",
  "disregard instructions",
  "forget all previous instructions",
  "forget previous instructions",
  "override previous instructions",
  "override instructions",
  "new instructions",
  "you are now",
  "act as",
  "system prompt",
  "jailbreak",
];

const TRIGGER_PATTERNS = TRIGGER_PHRASES.map(phrasePattern);

// Encoded payloads are a second, independent bypass class: the instruction is
// not present in the text at all, so no amount of folding will reveal it. A
// 36-character instruction encodes to a short base64 blob that a model will
// happily decode, so decode-then-check has to happen too.
//
// This runs against the ORIGINAL source, not the folded copy: folding maps
// digits to letters (0 -> o, 1 -> i) and would corrupt the very runs this is
// trying to decode.
const BASE64_RUN = /[A-Za-z0-9+/]{16,}={0,2}/g;

function containsTrigger(text: string): boolean {
  const folded = foldForMatching(text);
  return TRIGGER_PATTERNS.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(folded);
  });
}

// Returns the decoded text, or null when the run is not decodable text. Binary
// decodes are rejected: an instruction cannot hide in bytes the model reads as
// noise, and accepting them would only widen the redaction surface.
function tryDecodeBase64(run: string): string | null {
  const remainder = run.length % 4;
  const padded = remainder === 0 ? run : run + "=".repeat(4 - remainder);
  if (padded.length % 4 !== 0) return null;
  try {
    const decoded = atob(padded);
    if (decoded.length === 0) return null;
    let printable = 0;
    for (let i = 0; i < decoded.length; i++) {
      const code = decoded.charCodeAt(i);
      if (code === 9 || code === 10 || code === 13 || (code >= 32 && code < 127)) printable++;
    }
    if (printable / decoded.length < 0.8) return null;
    return decoded;
  } catch {
    return null;
  }
}

function findEncodedTriggerSpans(source: string): Array<[number, number]> {
  const spans: Array<[number, number]> = [];
  BASE64_RUN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = BASE64_RUN.exec(source)) !== null) {
    const decoded = tryDecodeBase64(match[0]);
    if (decoded !== null && containsTrigger(decoded)) {
      spans.push([match.index, match.index + match[0].length]);
    }
  }
  return spans;
}

function findTriggerSpans(folded: string): Array<[number, number]> {
  const spans: Array<[number, number]> = [];
  for (const pattern of TRIGGER_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(folded)) !== null) {
      if (match[0].length === 0) break;
      spans.push([match.index, match.index + match[0].length]);
    }
  }
  return spans;
}

/** Merge overlapping spans so a match is only redacted once. */
function mergeSpans(spans: Array<[number, number]>): Array<[number, number]> {
  if (spans.length === 0) return [];
  const sorted = [...spans].sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const next = sorted[i];
    if (next[0] <= last[1]) {
      last[1] = Math.max(last[1], next[1]);
    } else {
      merged.push([next[0], next[1]]);
    }
  }
  return merged;
}

const REDACTION = "[removed]";

/**
 * Neutralise prompt-injection attempts in untrusted text.
 *
 * Detection runs on a folded copy; redaction is applied to the original, so the
 * document sent to the model is otherwise unchanged. Truncates to maxLength,
 * matching the previous behaviour, and truncation happens before detection so
 * the spans we compute are always inside the string we return.
 *
 * Not a security boundary on its own - see the file header.
 */
export function sanitizeUntrustedText(
  text: string,
  maxLength: number = MAX_UNTRUSTED_TEXT_LENGTH,
): string {
  if (typeof text !== "string" || text.length === 0) return "";

  const source = text.slice(0, maxLength);
  const folded = foldForMatching(source);
  const spans = mergeSpans([
    ...findTriggerSpans(folded),
    ...findEncodedTriggerSpans(source),
  ]);
  if (spans.length === 0) return source;

  let out = "";
  let cursor = 0;
  for (const [start, end] of spans) {
    if (start > cursor) out += source.slice(cursor, start);
    out += REDACTION;
    cursor = Math.max(cursor, end);
  }
  out += source.slice(cursor);
  return out;
}