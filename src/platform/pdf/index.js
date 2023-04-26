/**
 * Accessible PDF generation
 * @name platform/pdf
 */

import './registerStaticFiles';

const blobStream = require('blob-stream');

export default function generatePdf(templateId, data) {
  // eslint-disable-next-line import/no-dynamic-require
  const template = require(`./templates/${templateId}`);

  const doc = template.generate(data);
  const stream = doc.pipe(blobStream());

  doc.end();

  stream.on('finish', () => {
    const pdfUrl = stream.toBlobURL('application/pdf');
    window.open(pdfUrl, '_self');
  });
}
