import { templates } from '@department-of-veterans-affairs/platform-pdf/exports';

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
    // TODO: Split selectedDebts into individual PDFs if needed
    const pdfResponseA = await getPdfBlob('disputeDebt', pdfData);
    const pdfResponseB = await getPdfBlob('disputeDebt', pdfData);

    // testing
    const filename = `dispute-debt.pdf`;
    const url = URL.createObjectURL(pdfResponseA);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    // end testing

    const formData = new FormData();
    formData.append('files[]', pdfResponseA);
    formData.append('files[]', pdfResponseB);

    return formData;
  } catch (error) {
    throw new Error('PDF generation failed', error);
  }
};
