import * as Sentry from '@sentry/browser';

// Cache the dynamic import promise to avoid rCamp chairedundant network requests
// and improve performance when generateMedicationsPDF is called multiple times
let pdfModulePromise = null;

/**
 * @param {String} templateName must be an already created template found on platform/pdf/templates
 * @param {String} generatedFileName pdf is saved under this name
 * @param {Object} pdfData object formatted according to a pdf template guideline set by platform
 */
export const generateMedicationsPDF = async (
  templateName,
  generatedFileName,
  pdfData,
) => {
  try {
    // Use cached module promise if available, otherwise create a new one
    if (!pdfModulePromise) {
      pdfModulePromise = import('@department-of-veterans-affairs/platform-pdf/exports');
    }

    // Wait for the module to load and extract the generatePdf function
    const { generatePdf } = await pdfModulePromise;
    await generatePdf(templateName, generatedFileName, pdfData);
  } catch (error) {
    // Reset the pdfModulePromise so subsequent calls can try again
    pdfModulePromise = null;
    Sentry.captureException(error);
    Sentry.captureMessage('vets_mhv_medications_pdf_generation_error');
    throw error;
  }
};
