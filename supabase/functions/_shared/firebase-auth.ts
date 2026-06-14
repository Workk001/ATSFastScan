// Firebase ID Token verification for Edge Functions
// Implements full cryptographic signature verification using Google's public keys

const FIREBASE_PROJECT_ID = Deno.env.get("FIREBASE_PROJECT_ID") || 'ats-fastscan-auth';
const GOOGLE_CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

interface FirebaseTokenPayload {
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  email?: string;
  email_verified?: boolean;
  firebase: {
    identities: Record<string, string[]>;
    sign_in_provider: string;
  };
}

interface JwtHeader {
  alg: string;
  kid: string;
  typ: string;
}

interface VerificationResult {
  valid: boolean;
  userId?: string;
  email?: string;
  error?: string;
}

// Cache for Google's public certificates
let cachedCerts: Record<string, string> | null = null;
let certsCacheExpiry = 0;

// Decode base64url
function base64UrlDecode(str: string): Uint8Array {
  const padding = '='.repeat((4 - str.length % 4) % 4);
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + padding;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Decode base64url to string
function base64UrlDecodeToString(str: string): string {
  const bytes = base64UrlDecode(str);
  return new TextDecoder().decode(bytes);
}

// Parse JWT header
function parseJwtHeader(token: string): JwtHeader | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(base64UrlDecodeToString(parts[0]));
  } catch {
    return null;
  }
}

// Parse JWT payload
function parseJwtPayload(token: string): FirebaseTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(base64UrlDecodeToString(parts[1]));
  } catch {
    return null;
  }
}

// Fetch Google's public certificates with caching
async function getGooglePublicCerts(): Promise<Record<string, string>> {
  const now = Date.now();
  
  if (cachedCerts && now < certsCacheExpiry) {
    return cachedCerts;
  }

  const response = await fetch(GOOGLE_CERTS_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch Google public certificates');
  }

  // Parse cache-control header to determine cache duration
  const cacheControl = response.headers.get('cache-control');
  let maxAge = 3600; // Default 1 hour
  if (cacheControl) {
    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
    if (maxAgeMatch) {
      maxAge = parseInt(maxAgeMatch[1], 10);
    }
  }

  cachedCerts = await response.json();
  certsCacheExpiry = now + (maxAge * 1000);
  
  return cachedCerts!;
}

// Convert PEM certificate to CryptoKey
async function pemToCryptoKey(pem: string): Promise<CryptoKey> {
  // Remove PEM headers and decode base64
  const pemContents = pem
    .replace(/-----BEGIN CERTIFICATE-----/g, '')
    .replace(/-----END CERTIFICATE-----/g, '')
    .replace(/\s/g, '');
  
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  // Extract public key from X.509 certificate
  const spki = extractSPKIFromCert(binaryDer);
  
  // Create a new ArrayBuffer and copy data to ensure correct type
  const spkiBuffer = new ArrayBuffer(spki.length);
  new Uint8Array(spkiBuffer).set(spki);
  
  return await crypto.subtle.importKey(
    'spki',
    spkiBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['verify']
  );
}

// Extract SubjectPublicKeyInfo from X.509 certificate
function extractSPKIFromCert(cert: Uint8Array): Uint8Array {
  // Simple ASN.1 DER parser for X.509 certificates
  // This extracts the SubjectPublicKeyInfo field
  
  let offset = 0;
  
  // Read SEQUENCE (Certificate)
  if (cert[offset++] !== 0x30) throw new Error('Invalid certificate format');
  offset = skipLength(cert, offset);
  
  // Read SEQUENCE (TBSCertificate)
  if (cert[offset++] !== 0x30) throw new Error('Invalid TBSCertificate');
  const tbsLength = readLength(cert, offset);
  offset = skipLength(cert, offset);
  
  // Skip version if present (context-specific tag 0)
  if (cert[offset] === 0xa0) {
    offset++;
    const versionLength = readLength(cert, offset);
    offset = skipLength(cert, offset) + versionLength;
  }
  
  // Skip serialNumber (INTEGER)
  if (cert[offset++] !== 0x02) throw new Error('Invalid serialNumber');
  const serialLength = readLength(cert, offset);
  offset = skipLength(cert, offset) + serialLength;
  
  // Skip signature algorithm (SEQUENCE)
  if (cert[offset++] !== 0x30) throw new Error('Invalid signature algorithm');
  const sigAlgLength = readLength(cert, offset);
  offset = skipLength(cert, offset) + sigAlgLength;
  
  // Skip issuer (SEQUENCE)
  if (cert[offset++] !== 0x30) throw new Error('Invalid issuer');
  const issuerLength = readLength(cert, offset);
  offset = skipLength(cert, offset) + issuerLength;
  
  // Skip validity (SEQUENCE)
  if (cert[offset++] !== 0x30) throw new Error('Invalid validity');
  const validityLength = readLength(cert, offset);
  offset = skipLength(cert, offset) + validityLength;
  
  // Skip subject (SEQUENCE)
  if (cert[offset++] !== 0x30) throw new Error('Invalid subject');
  const subjectLength = readLength(cert, offset);
  offset = skipLength(cert, offset) + subjectLength;
  
  // Now we're at SubjectPublicKeyInfo (SEQUENCE)
  if (cert[offset] !== 0x30) throw new Error('Invalid SubjectPublicKeyInfo');
  const spkiStart = offset;
  offset++;
  const spkiContentLength = readLength(cert, offset);
  offset = skipLength(cert, offset);
  const spkiEnd = offset + spkiContentLength;
  
  return cert.slice(spkiStart, spkiEnd);
}

function readLength(data: Uint8Array, offset: number): number {
  const firstByte = data[offset];
  if (firstByte < 0x80) {
    return firstByte;
  }
  const numBytes = firstByte & 0x7f;
  let length = 0;
  for (let i = 0; i < numBytes; i++) {
    length = (length << 8) | data[offset + 1 + i];
  }
  return length;
}

function skipLength(data: Uint8Array, offset: number): number {
  const firstByte = data[offset];
  if (firstByte < 0x80) {
    return offset + 1;
  }
  return offset + 1 + (firstByte & 0x7f);
}

// Verify JWT signature using Google's public key
async function verifySignature(token: string, publicKey: CryptoKey): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  const signedContent = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const signatureBytes = base64UrlDecode(parts[2]);
  
  // Create a new ArrayBuffer and copy data to ensure correct type
  const signatureBuffer = new ArrayBuffer(signatureBytes.length);
  new Uint8Array(signatureBuffer).set(signatureBytes);
  
  try {
    return await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      signatureBuffer,
      signedContent
    );
  } catch {
    return false;
  }
}

// Verify Firebase ID token with full signature verification
export async function verifyFirebaseToken(authHeader: string | null): Promise<VerificationResult> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid Authorization header' };
  }

  const token = authHeader.replace('Bearer ', '');
  
  // Parse header to get key ID
  const header = parseJwtHeader(token);
  if (!header) {
    return { valid: false, error: 'Invalid token format' };
  }
  
  // Validate algorithm
  if (header.alg !== 'RS256') {
    return { valid: false, error: 'Invalid token algorithm' };
  }
  
  if (!header.kid) {
    return { valid: false, error: 'Missing key ID in token' };
  }

  // Parse payload for claims validation
  const payload = parseJwtPayload(token);
  if (!payload) {
    return { valid: false, error: 'Failed to parse token payload' };
  }

  // Validate issuer - must match exactly
  const expectedIssuer = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;
  if (payload.iss !== expectedIssuer) {
    return { valid: false, error: 'Invalid token issuer' };
  }

  // Validate audience - must match project ID
  if (payload.aud !== FIREBASE_PROJECT_ID) {
    return { valid: false, error: 'Invalid token audience' };
  }

  // Validate expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    return { valid: false, error: 'Token has expired' };
  }

  // Validate issued at time (not in the future, with 5 min clock skew)
  if (payload.iat > now + 300) {
    return { valid: false, error: 'Token issued in the future' };
  }

  // Validate auth_time is in the past
  if (payload.auth_time > now + 300) {
    return { valid: false, error: 'auth_time is in the future' };
  }

  // Validate sub (subject) is present and non-empty
  if (!payload.sub || typeof payload.sub !== 'string' || payload.sub.length === 0) {
    return { valid: false, error: 'Invalid token subject' };
  }

  // Fetch Google's public certificates and verify signature
  try {
    const certs = await getGooglePublicCerts();
    const cert = certs[header.kid];
    
    if (!cert) {
      return { valid: false, error: 'Unknown signing key' };
    }
    
    const publicKey = await pemToCryptoKey(cert);
    const isValidSignature = await verifySignature(token, publicKey);
    
    if (!isValidSignature) {
      return { valid: false, error: 'Invalid token signature' };
    }
  } catch (error) {
    console.error('Signature verification error:', error);
    return { valid: false, error: 'Failed to verify token signature' };
  }

  // Token is valid
  return {
    valid: true,
    userId: payload.user_id || payload.sub,
    email: payload.email,
  };
}


// Input validation helpers
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_BASE64_SIZE = Math.ceil(MAX_FILE_SIZE_BYTES * 1.37); // Account for base64 overhead
export const MAX_TEXT_LENGTH = 100000; // ~100KB of text
export const MAX_JD_LENGTH = 10000; // 10K chars for job description
export const ALLOWED_FILE_TYPES = ['pdf', 'docx', 'doc'];

export interface ValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
}

export function validateFileInput(
  pdfBase64?: string,
  text?: string,
  fileType?: string,
  jobDescription?: string
): ValidationResult {
  // Validate base64 size
  if (pdfBase64) {
    if (pdfBase64.length > MAX_BASE64_SIZE) {
      return {
        valid: false,
        error: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`,
        code: 'FILE_TOO_LARGE'
      };
    }
    
    // Validate base64 format (basic check)
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(pdfBase64.slice(0, 1000))) {
      return {
        valid: false,
        error: 'Invalid file encoding',
        code: 'INVALID_ENCODING'
      };
    }
  }

  // Validate text length
  if (text && text.length > MAX_TEXT_LENGTH) {
    return {
      valid: false,
      error: 'Document text is too large',
      code: 'TEXT_TOO_LARGE'
    };
  }

  // Validate file type
  if (fileType && !ALLOWED_FILE_TYPES.includes(fileType.toLowerCase())) {
    return {
      valid: false,
      error: 'Invalid file type. Only PDF and DOCX allowed',
      code: 'INVALID_FILE_TYPE'
    };
  }

  // Validate job description length
  if (jobDescription && jobDescription.length > MAX_JD_LENGTH) {
    return {
      valid: false,
      error: 'Job description too long (max 10,000 characters)',
      code: 'JD_TOO_LONG'
    };
  }

  return { valid: true };
}
