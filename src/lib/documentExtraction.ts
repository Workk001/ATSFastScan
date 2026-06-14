/**
 * Multi-step document extraction pipeline
 * Supports PDF (text-based) and DOCX with validation
 */

export type ExtractionMethod = 'docx' | 'pdf-text' | 'pdf-fallback' | 'failed';

export interface ExtractionResult {
  text: string;
  method: ExtractionMethod;
  success: boolean;
  error?: string;
}

// Minimum thresholds for valid extraction
const MIN_TEXT_LENGTH = 300;
const MIN_WORD_COUNT = 30;
const MAX_NON_ALPHA_RATIO = 0.3; // Max 30% non-alphabetic characters

/**
 * Normalize whitespace and clean extracted text
 */
function normalizeText(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\\t/g, ' ')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate the ratio of non-alphabetic characters
 */
function getNonAlphaRatio(text: string): number {
  if (!text.length) return 1;
  const alphaChars = (text.match(/[a-zA-Z]/g) || []).length;
  return 1 - (alphaChars / text.length);
}

/**
 * Check for common metadata patterns that indicate corrupted extraction
 */
function hasMetadataPatterns(text: string): boolean {
  const metadataPatterns = [
    /\/Type\s*\/\w+/gi,
    /\/Filter\s*\/\w+/gi,
    /obj\s*<<.*?>>/gi,
    /endobj/gi,
    /stream\s*\n/gi,
    /xref\s*\d+/gi,
    /%PDF-\d+\.\d+/gi,
  ];
  
  let metadataMatches = 0;
  for (const pattern of metadataPatterns) {
    const matches = text.match(pattern) || [];
    metadataMatches += matches.length;
  }
  
  // If more than 5 metadata patterns, likely corrupted
  return metadataMatches > 5;
}

/**
 * Check for recognizable resume/cover letter sections
 */
function hasRecognizableSections(text: string): boolean {
  const lowerText = text.toLowerCase();
  const sectionKeywords = [
    'experience', 'education', 'skills', 'summary', 'objective',
    'work history', 'employment', 'qualifications', 'contact',
    'dear', 'sincerely', 'regards', 'position', 'opportunity',
    'responsibilities', 'achievements', 'projects', 'certifications'
  ];
  
  let matchCount = 0;
  for (const keyword of sectionKeywords) {
    if (lowerText.includes(keyword)) {
      matchCount++;
    }
  }
  
  // At least 2 recognizable keywords
  return matchCount >= 2;
}

/**
 * Validate extracted text quality
 */
export function validateExtraction(text: string): { valid: boolean; reason?: string } {
  const normalized = normalizeText(text);
  
  // Check minimum length
  if (normalized.length < MIN_TEXT_LENGTH) {
    return { valid: false, reason: `Text too short (${normalized.length} chars, need ${MIN_TEXT_LENGTH}+)` };
  }
  
  // Check word count
  const words = normalized.match(/[A-Za-z]{2,}/g) || [];
  if (words.length < MIN_WORD_COUNT) {
    return { valid: false, reason: `Too few words (${words.length} words, need ${MIN_WORD_COUNT}+)` };
  }
  
  // Check non-alpha ratio
  const nonAlphaRatio = getNonAlphaRatio(normalized);
  if (nonAlphaRatio > MAX_NON_ALPHA_RATIO) {
    return { valid: false, reason: `Too many symbols (${Math.round(nonAlphaRatio * 100)}% non-alphabetic)` };
  }
  
  // Check for metadata patterns
  if (hasMetadataPatterns(normalized)) {
    return { valid: false, reason: 'Contains PDF metadata instead of readable text' };
  }
  
  // Check for recognizable sections
  if (!hasRecognizableSections(normalized)) {
    return { valid: false, reason: 'No recognizable resume/cover letter sections found' };
  }
  
  return { valid: true };
}

/**
 * Extract text from PDF using stream parsing
 */
function extractPdfText(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const decoder = new TextDecoder('utf-8', { fatal: false });
  const content = decoder.decode(bytes);
  
  let text = '';
  
  // Extract text between BT (begin text) and ET (end text) markers
  const textBlocks = content.match(/BT[\s\S]*?ET/g) || [];
  
  for (const block of textBlocks) {
    // Extract from Tj operator (single string)
    const tjMatches = block.match(/\(([^)]*)\)\s*Tj/g) || [];
    for (const tj of tjMatches) {
      const match = tj.match(/\(([^)]*)\)/);
      if (match) {
        text += match[1] + ' ';
      }
    }
    
    // Extract from TJ operator (array of strings)
    const tjArrayMatches = block.match(/\[(.*?)\]\s*TJ/g) || [];
    for (const tjArray of tjArrayMatches) {
      const stringMatches = tjArray.match(/\(([^)]*)\)/g) || [];
      for (const str of stringMatches) {
        const match = str.match(/\(([^)]*)\)/);
        if (match) {
          text += match[1];
        }
      }
      text += ' ';
    }
  }
  
  // Try to extract from stream content
  const streamMatches = content.match(/stream\s*([\s\S]*?)\s*endstream/g) || [];
  for (const stream of streamMatches) {
    // Look for readable text patterns in streams
    const readableText = stream.match(/[A-Za-z][A-Za-z\s,.\-']+[A-Za-z]/g) || [];
    for (const readable of readableText) {
      if (readable.length > 10) {
        text += readable + ' ';
      }
    }
  }
  
  return normalizeText(text);
}

/**
 * Extract text from DOCX using JSZip
 */
async function extractDocxText(buffer: ArrayBuffer): Promise<string> {
  try {
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file('word/document.xml')?.async('string');
    
    if (!documentXml) {
      return '';
    }
    
    let text = '';
    
    // Extract text from <w:t> tags (preserves order)
    const textMatches = documentXml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
    for (const match of textMatches) {
      const content = match.replace(/<[^>]+>/g, '');
      text += content + ' ';
    }
    
    // Check for paragraph breaks to add spacing
    text = text.replace(/\s{3,}/g, '\n');
    
    return normalizeText(text);
  } catch (e) {
    console.error('[Extraction] DOCX error:', e);
    return '';
  }
}

/**
 * Get file type from File object
 */
export function getFileType(file: File): 'pdf' | 'docx' | 'unknown' {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  
  if (ext === 'docx' || file.type.includes('wordprocessingml')) {
    return 'docx';
  }
  if (ext === 'pdf' || file.type === 'application/pdf') {
    return 'pdf';
  }
  if (ext === 'doc') {
    return 'docx'; // Treat .doc as docx for extraction attempt
  }
  
  return 'unknown';
}

/**
 * Main extraction function - multi-step pipeline
 */
export async function extractDocument(file: File): Promise<ExtractionResult> {
  const fileType = getFileType(file);
  if (import.meta.env.DEV) {
    console.log(`[Extraction] Starting extraction for ${file.name} (type: ${fileType})`);
  }
  
  if (fileType === 'unknown') {
    return {
      text: '',
      method: 'failed',
      success: false,
      error: 'Unsupported file type. Please upload a PDF or DOCX file.'
    };
  }
  
  const buffer = await file.arrayBuffer();
  let extractedText = '';
  let method: ExtractionMethod = 'failed';
  
  // Step 1: Extract based on file type
  if (fileType === 'docx') {
    if (import.meta.env.DEV) {
      console.log('[Extraction] Attempting DOCX extraction...');
    }
    extractedText = await extractDocxText(buffer);
    method = 'docx';
    if (import.meta.env.DEV) {
      console.log(`[Extraction] DOCX extracted ${extractedText.length} chars`);
    }
  } else {
    // PDF extraction
    if (import.meta.env.DEV) {
      console.log('[Extraction] Attempting PDF text extraction...');
    }
    extractedText = extractPdfText(buffer);
    method = 'pdf-text';
    if (import.meta.env.DEV) {
      console.log(`[Extraction] PDF text extracted ${extractedText.length} chars`);
    }
    
    // Check if PDF text extraction was sufficient
    const validation = validateExtraction(extractedText);
    
    if (!validation.valid) {
      if (import.meta.env.DEV) {
        console.log(`[Extraction] PDF text extraction insufficient: ${validation.reason}`);
      }
      // Mark as needing server-side fallback
      method = 'pdf-fallback';
    }
  }
  
  // Step 2: Validate extraction
  const validation = validateExtraction(extractedText);
  if (import.meta.env.DEV) {
    console.log(`[Extraction] Validation result: ${validation.valid ? 'PASS' : 'FAIL'} - ${validation.reason || 'OK'}`);
  }
  
  if (!validation.valid) {
    // For PDFs that failed validation, we'll try server-side extraction
    if (fileType === 'pdf') {
      return {
        text: extractedText,
        method: 'pdf-fallback',
        success: false,
        error: validation.reason
      };
    }
    
    // For DOCX that failed, provide clear error
    return {
      text: '',
      method: 'failed',
      success: false,
      error: 'This file is not ATS-readable. Please upload a DOCX or export PDF from Word/Google Docs.'
    };
  }
  
  return {
    text: extractedText,
    method,
    success: true
  };
}

/**
 * Convert file to base64 for server-side fallback
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}
