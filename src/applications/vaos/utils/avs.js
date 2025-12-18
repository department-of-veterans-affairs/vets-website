// AVS (After Visit Summary) utilities
// Centralizes logic for transforming AVS PDF metadata into safe download artifacts.
import { captureError } from './error';
/**
 * Convert a base64 encoded PDF string into a Blob object URL.
 * Returns null if input is falsy or decoding fails.
 *
 * @param {string} base64 Base64 encoded PDF binary
 * @param {string} [contentType='application/pdf'] MIME type
 * @returns {string|null} object URL suitable for va-link usage
 */
export function base64ToPdfObjectUrl(base64, contentType = 'application/pdf') {
  if (!base64) return null;
  try {
    const byteString = atob(base64);
    const { length } = byteString;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i += 1) {
      bytes[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: contentType });
    return URL.createObjectURL(blob);
  } catch (e) {
    captureError(e, 'Failed to convert base64 string to PDF blob URL');
    return null;
  }
}

/**
 * Bulk convert an array of AVS file descriptors to object URLs.
 * Returns an array of object URLs (some entries may be null if decoding failed).
 *
 * @param {Array<{binary:string, contentType?:string}>} files AVS PDF descriptors
 * @returns {string[]} Array of object URLs
 */
export function buildPdfObjectUrls(files = []) {
  return files.map(f =>
    base64ToPdfObjectUrl(f?.binary, f?.contentType || 'application/pdf'),
  );
}

/**
 * Revoke an array of object URLs safely.
 *
 * @param {string[]} urls Object URLs produced earlier
 */
export function revokeObjectUrls(urls = []) {
  urls.forEach(u => u && URL.revokeObjectURL(u));
}
