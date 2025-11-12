/**
 * @fileoverview PDF download utilities for VA Form 21-2680
 * @module utils/pdfDownload
 *
 * Provides functionality to fetch and download PDF versions of submitted
 * VA Form 21-2680 (Examination for Housebound Status) applications.
 */

import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';
import { API_ENDPOINTS } from '../constants/constants';

/**
 * Fetches a PDF blob from the backend API
 *
 * @param {string} guid - The submission GUID
 * @returns {Promise<Blob>} Promise resolving to PDF blob
 * @throws {Error} If guid is missing, API request fails, or response is not a PDF
 *
 * @example
 * try {
 *   const blob = await fetchPdfApi('12345678-1234-1234-1234-123456789abc');
 *   downloadBlob(blob, '21-2680_John_Doe.pdf');
 * } catch (error) {
 *   // Error is tracked via recordEvent and thrown
 * }
 */
export const fetchPdfApi = async guid => {
  if (!guid) {
    throw new Error('Submission GUID is required to download PDF');
  }

  try {
    const response = await apiRequest(`${API_ENDPOINTS.downloadPdf}/${guid}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status}`);
    }

    const blob = await response.blob();

    // Validate that we received a PDF
    if (blob.type !== 'application/pdf') {
      throw new Error(`Expected PDF but got ${blob.type}`);
    }

    recordEvent({
      event: 'form-21-2680--pdf-download-success',
    });

    return blob;
  } catch (error) {
    recordEvent({
      event: 'form-21-2680--pdf-download-failure',
      'error-message': error.message,
    });

    throw error;
  }
};

/**
 * Triggers a browser download for a blob with the specified filename
 *
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The filename for the download
 *
 * @example
 * const blob = new Blob(['content'], { type: 'application/pdf' });
 * downloadBlob(blob, '21-2680_John_Doe.pdf');
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Formats a PDF filename based on veteran name
 * Removes special characters and formats as: 21-2680_FirstName_LastName.pdf
 *
 * @param {Object} veteranName - The veteran's name object
 * @param {string} [veteranName.first] - First name
 * @param {string} [veteranName.last] - Last name
 * @returns {string} Formatted filename
 *
 * @example
 * formatPdfFilename({ first: 'John', last: 'Doe' })
 * // Returns: '21-2680_John_Doe.pdf'
 *
 * formatPdfFilename({ first: "John-Paul's", last: "O'Brien" })
 * // Returns: '21-2680_JohnPauls_OBrien.pdf'
 *
 * formatPdfFilename({})
 * // Returns: '21-2680_Veteran_Submission.pdf'
 */
export const formatPdfFilename = veteranName => {
  const firstName = veteranName?.first || 'Veteran';
  const lastName = veteranName?.last || 'Submission';

  // Remove special characters and spaces from names
  const cleanFirst = firstName.replace(/[^a-zA-Z0-9]/g, '');
  const cleanLast = lastName.replace(/[^a-zA-Z0-9]/g, '');

  return `21-2680_${cleanFirst}_${cleanLast}.pdf`;
};
