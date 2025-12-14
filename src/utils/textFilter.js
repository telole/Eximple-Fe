/**
 * Filter UTF-16 characters and invalid encoding from text
 * Removes BOM, null bytes, and other invalid characters
 */
export function filterUTF16(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Remove UTF-16 BOM (Byte Order Mark) - FEFF
  let filtered = text.replace(/\uFEFF/g, '');
  
  // Remove UTF-8 BOM
  filtered = filtered.replace(/^\uEF\uBB\uBF/, '');
  
  // Remove null bytes
  filtered = filtered.replace(/\x00/g, '');
  
  // Remove other control characters except newlines, tabs, and carriage returns
  filtered = filtered.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  // Remove invalid UTF-16 surrogate pairs
  filtered = filtered.replace(/[\uD800-\uDFFF]/g, '');
  
  // Remove zero-width characters
  filtered = filtered.replace(/[\u200B-\u200D\uFEFF]/g, '');
  
  // Remove other problematic Unicode characters
  filtered = filtered.replace(/[\uFFFE\uFFFF]/g, '');
  
  return filtered.trim();
}

/**
 * Sanitize HTML content by filtering UTF-16 before rendering
 */
export function sanitizeHTML(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  return filterUTF16(html);
}

/**
 * Sanitize plain text content
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return filterUTF16(text);
}

