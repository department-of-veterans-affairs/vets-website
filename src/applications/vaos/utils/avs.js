// AVS (After Visit Summary) utilities
// Centralizes logic for transforming AVS PDF metadata into safe download artifacts.
import { AMBULATORY_PATIENT_SUMMARY } from './constants';
import { captureError } from './error';

/**
 * Represents an AVS (After Visit Summary) PDF descriptor and optional binary.
 * @typedef {object} AvsObj
 * @property {string} apptId Appointment ID associated with this AVS
 * @property {string} name Name of the AVS document
 * @property {string} noteType Note type code (e.g., AMBULATORY_PATIENT_SUMMARY)
 * @property {string[]} loincCodes Array of LOINC codes associated with this AVS
 * @property {string} id Unique document ID for fetching the binary
 * @property {string} [contentType] MIME type of the PDF binary
 * @property {string} [binary] Base64 encoded PDF binary data
 * @property {string} [error] Error message if fetching the binary failed
 */

/**
 * AVS fetched PDF data structure.
 * @typedef {object} AvsFetchedData
 * @property {string} docId Document ID matching the AVS PDF descriptor
 * @property {string} [binary] Base64 encoded PDF binary data
 * @property {string} [error] Error message if fetching the binary failed
 */

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
 * @param {Array<AvsObj>} files AVS PDF descriptors
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

/**
 * Checks if an AVS PDF object has valid structure (noteType and id).
 *
 * @param {AvsObj} avsPdfObj The AVS PDF object to validate
 * @returns {boolean} True if object has required noteType and id fields
 */
export function avsIsValid(avsPdfObj) {
  return (
    [AMBULATORY_PATIENT_SUMMARY].includes(avsPdfObj?.noteType) &&
    !!avsPdfObj?.id
  );
}

/**
 * Checks if an AVS PDF object has been fetched (has binary or error).
 *
 * @param {AvsObj} avsPdfObj The AVS PDF object to check
 * @returns {boolean} True if object has binary data or error status
 */
export function avsHasData(avsPdfObj) {
  return !!(avsPdfObj?.binary || avsPdfObj?.error);
}

/**
 * Checks if an AVS PDF object is ready to display (valid + has data).
 *
 * @param {AvsObj} avsPdfObj The AVS PDF object to check
 * @returns {boolean} True if object is valid and has been fetched
 */
export function avsIsReady(avsPdfObj) {
  return avsIsValid(avsPdfObj) && avsHasData(avsPdfObj);
}

/**
 * Separate AVS PDFs into those needing fetch and those that don't.
 *
 * @param {AvsObj[]} avsPdf AVS PDF descriptors
 * @returns {{toFetch: AvsObj[], doNotFetch: AvsObj[]}} Object with toFetch and doNotFetch arrays
 *
 */
export const separateFetchableAvsPdfs = avsPdf => {
  // handle null/undefined input
  return (avsPdf ?? []).reduce(
    (acc, avsPdfObj) => {
      // Determine if this AVS PDF needs to be fetched
      // Only fetch if valid structure but no data yet
      const key =
        avsIsValid(avsPdfObj) && !avsHasData(avsPdfObj)
          ? 'toFetch' // Valid PDF needing fetch
          : 'doNotFetch'; // Already have PDF data or not correct types
      acc[key].push(avsPdfObj);
      return acc;
    },
    {
      toFetch: [],
      doNotFetch: [],
    },
  );
};
