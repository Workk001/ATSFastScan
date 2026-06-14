const ALLOWED_DOMAINS = new Set([
  // Major providers
  "gmail.com", "googlemail.com",
  "outlook.com", "hotmail.com", "live.com", "msn.com",
  "yahoo.com", "yahoo.co.in", "yahoo.co.uk",
  "icloud.com", "me.com", "mac.com",
  "protonmail.com", "proton.me",
  "aol.com",
  "zoho.com", "zohomail.com",
  "yandex.com", "yandex.ru",
  "mail.com",
  "gmx.com", "gmx.net",
  // India-specific
  "rediffmail.com",
  // Common edu/work - we allow any .edu or .ac domain via suffix check
]);

const ALLOWED_SUFFIXES = [".edu", ".ac.in", ".ac.uk", ".edu.in", ".gov", ".gov.in", ".org"];

export function isAllowedEmailDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  if (ALLOWED_DOMAINS.has(domain)) return true;
  return ALLOWED_SUFFIXES.some((suffix) => domain.endsWith(suffix));
}
