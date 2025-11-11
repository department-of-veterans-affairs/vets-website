/**
 * @module utils/pdfDownload
 * @description PDF download utilities for VA Form 21-0779
 */

import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';
import { API_ENDPOINTS } from '../constants/constants';

/**
 * Ensures a valid CSRF token exists in localStorage
 * @param {string} eventLabel - Label for tracking event
 * @returns {Promise<void>}
 */
export const ensureValidCSRFToken = async eventLabel => {
  const csrfToken = localStorage.getItem('csrfToken');

  if (!csrfToken) {
    try {
      await apiRequest(API_ENDPOINTS.csrfCheck, { method: 'HEAD' });

      recordEvent({
        event: 'form-21-0779--csrf-token-success',
        label: eventLabel,
      });
    } catch (error) {
      recordEvent({
        event: 'form-21-0779--csrf-token-failure',
        label: eventLabel,
      });
      throw error;
    }
  }
};

/**
 * Downloads the PDF form from the API
 * @param {string} formData - The form data as JSON string
 * @returns {Promise<Blob>} The PDF blob
 */
export const fetchPdfApi = async formData => {
  // Ensure we have a valid CSRF token
  await ensureValidCSRFToken('fetchPdf');

  if (!formData) {
    throw new Error('Form data is required to download PDF');
  }

  try {
    const response = await apiRequest(API_ENDPOINTS.downloadPdf, {
      method: 'POST',
      body: JSON.stringify({ form: formData }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the response is ok
    if (!response || !response.ok) {
      throw new Error(
        `Failed to fetch PDF: ${response?.status || 'Unknown error'}`,
      );
    }

    // Get the blob from the response
    const blob = await response.blob();

    // Verify it's actually a PDF
    if (blob.type !== 'application/pdf') {
      throw new Error(`Expected PDF but got ${blob.type}`);
    }

    recordEvent({
      event: 'form-21-0779--pdf-download-success',
    });

    return blob;
  } catch (error) {
    recordEvent({
      event: 'form-21-0779--pdf-download-failure',
      'error-message': error.message,
    });

    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage('PDF download failed for 21-0779');
    });

    throw error;
  }
};

/**
 * Triggers browser download of a blob
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The filename for the download
 */
export const downloadBlob = (blob, filename) => {
  // Create object URL for the blob
  const url = window.URL.createObjectURL(blob);

  // Create temporary anchor element and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Formats the filename for the PDF download
 * @param {Object} veteranName - The veteran's name object
 * @returns {string} Formatted filename
 */
export const formatPdfFilename = veteranName => {
  const firstName = veteranName?.first || 'Veteran';
  const lastName = veteranName?.last || 'Submission';

  // Remove special characters and spaces for filename safety
  const safeFirst = firstName.replace(/[^a-zA-Z0-9]/g, '');
  const safeLast = lastName.replace(/[^a-zA-Z0-9]/g, '');

  return `21-0779_${safeFirst}_${safeLast}.pdf`;
};
