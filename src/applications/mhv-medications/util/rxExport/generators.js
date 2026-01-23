import * as Sentry from '@sentry/browser';
import { generateTimestamp, formatUserNameForFilename } from './formatters';

// Cache the dynamic import promise for PDF module
let pdfModulePromise = null;

// ============================================================================
// PDF Generation
// ============================================================================

/**
 * Generate and download a PDF document
 * @param {string} templateName - PDF template name
 * @param {string} filename - Output filename
 * @param {Object} pdfData - PDF document data
 */
export const generatePdf = async (templateName, filename, pdfData) => {
  try {
    if (!pdfModulePromise) {
      pdfModulePromise = import('@department-of-veterans-affairs/platform-pdf/exports');
    }

    const { generatePdf: platformGeneratePdf } = await pdfModulePromise;
    await platformGeneratePdf(templateName, filename, pdfData);
  } catch (error) {
    pdfModulePromise = null;
    Sentry.captureException(error);
    Sentry.captureMessage('vets_mhv_medications_pdf_generation_error');
    throw error;
  }
};

// ============================================================================
// TXT Generation
// ============================================================================

/**
 * Generate and download a text file
 * @param {string} content - Text file content
 * @param {string} filename - Output filename
 */
export const generateTxt = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

// ============================================================================
// Filename Generation
// ============================================================================

/**
 * Generate export filename
 * @param {Object} options
 * @param {Object} options.userName - User name object
 * @param {boolean} options.isNonVA - Whether prescription is non-VA
 * @param {boolean} options.isDetails - Whether this is details page (vs list)
 * @returns {string}
 */
export const generateExportFilename = ({
  userName,
  isNonVA = false,
  isDetails = false,
}) => {
  const prefix = isNonVA ? 'Non-VA' : 'VA';
  const pageType = isDetails ? 'medications-details' : 'medications-list';
  const userSegment = formatUserNameForFilename(userName);
  return `${prefix}-${pageType}-${userSegment}-${generateTimestamp()}`;
};
