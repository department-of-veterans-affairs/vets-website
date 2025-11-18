import * as Sentry from '@sentry/browser';

// Cache the dynamic import promise to avoid redundant network requests
let pdfModulePromise = null;

// 'Manually' generating PDF instead of using generatePdf so we can
//  get the blob and send it to the API
const getPdfBlob = async (templateId, data) => {
  // Use cached module promise if available, otherwise create a new one
  if (!pdfModulePromise) {
    pdfModulePromise = import('@department-of-veterans-affairs/platform-pdf/exports').catch(
      () => {
        // Fallback for test environments where PDF module isn't available
        return { templates: {} };
      },
    );
  }

  // Wait for the module to load and extract the templates
  const { templates } = await pdfModulePromise;

  // Throw error for test environments or when template doesn't exist
  if (!templates[templateId]) {
    throw new Error(`PDF template '${templateId}' not available`);
  }

  const template = templates[templateId]();
  const doc = await template.generate(data);

  const chunks = [];
  return new Promise((resolve, reject) => {
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const blob = new Blob([Buffer.concat(chunks)], {
        type: 'application/pdf',
      });
      resolve(blob);
    });
    doc.on('error', reject);
    doc.end();
  });
};

export const handlePdfGeneration = async pdfData => {
  try {
    const { education, compAndPen, metadata } = pdfData;
    const formData = new FormData();

    // Generate the PDF for education debts if present
    if (education) {
      const educationPdfData = await getPdfBlob('disputeDebt', education);
      formData.append('files[]', educationPdfData);
    }

    // Generate the PDF for comp and pen debts if present
    if (compAndPen) {
      const compAndPenPdfData = await getPdfBlob('disputeDebt', compAndPen);
      formData.append('files[]', compAndPenPdfData);
    }

    // shouldn't happen, but just in case
    if (!compAndPen && !education) {
      throw new Error(
        '`Dispute Debt pdf generation failed: No debts to generate PDF for.',
      );
    }

    // Add metadata to FormData if present
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    // Returning FormData to be used in the API request
    return formData;
  } catch (error) {
    // Reset the pdfModulePromise so subsequent calls can try again
    pdfModulePromise = null;

    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(
        `Dispute Debt - PDF - generation failed in handlePdfGeneration: ${
          error?.detail
        }`,
      );
    });
    return null;
  }
};

export const generateVeteranPdf = async pdfData => {
  try {
    const { education, compAndPen, metadata } = pdfData;

    // Combine all selected debts (education + comp & pen) into a single array
    const combinedSelectedDebts = [
      ...(education?.selectedDebts || []),
      ...(compAndPen?.selectedDebts || []),
    ];

    // No debts at all → fail early
    if (!combinedSelectedDebts.length) {
      throw new Error(
        '`Dispute Debt pdf generation failed: No debts to generate PDF for.',
      );
    }

    // Use whichever side exists as the base (they both have veteran + submissionDetails)
    const basePdfData = education || compAndPen;

    // Build the single payload expected by disputeDebtVeteranFacing:
    // { veteran, submissionDetails, selectedDebts, ... }
    const combinedPdfData = {
      ...basePdfData,
      selectedDebts: combinedSelectedDebts,
    };

    // Generate ONE veteran-facing PDF containing all debts
    const pdfBlob = await getPdfBlob(
      'disputeDebtVeteranFacing',
      combinedPdfData,
    );

    const formData = new FormData();
    formData.append('files[]', pdfBlob);

    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    // Returning FormData to be used in the API request
    return formData;
  } catch (error) {
    // Reset the pdfModulePromise so subsequent calls can try again
    pdfModulePromise = null;

    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(
        `Veteran Facing Dispute Debt - PDF - generation failed in generateVeteranPdf: ${
          error?.detail
        }`,
      );
    });
    return null;
  }
};
