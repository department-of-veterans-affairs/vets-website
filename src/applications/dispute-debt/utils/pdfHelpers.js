import * as Sentry from '@sentry/browser';
// import { templates } from '@department-of-veterans-affairs/platform-pdf/exports';
import { templates } from '~/platform/pdf/exportsFile';

// 'Manually' generating PDF instead of using generatePdf so we can
//  get the blob and send it to the API
const getPdfBlob = async (templateId, data) => {
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
    const formData = new FormData();

    // Generate the PDF for education debts if present
    if (pdfData.education) {
      const educationPdfData = await getPdfBlob(
        'disputeDebt',
        pdfData.education,
      );
      formData.append('files[]', educationPdfData);
    }

    // Generate the PDF for comp and pen debts if present
    if (pdfData.compAndPen) {
      const compAndPenPdfData = await getPdfBlob(
        'disputeDebt',
        pdfData.compAndPen,
      );
      formData.append('files[]', compAndPenPdfData);
    }

    // shouldn't happen, but just in case
    if (!pdfData.compAndPen && !pdfData.education) {
      throw new Error(
        '`Dispute Debt pdf generation failed: No debts to generate PDF for.',
      );
    }

    // Returning FormData to be used in the API request
    return formData;
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(
        `Dispute Debt pdf generation failed in handlePdfGeneration: ${
          error?.detail
        }`,
      );
    });
    return null;
  }
};
