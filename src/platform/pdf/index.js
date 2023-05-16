/**
 * Accessible PDF generation
 * @name platform/pdf
 */
import './registerStaticFiles';

const blobStream = require('blob-stream');
const fileSaver = require('file-saver');

export default async function generatePdf(templateId, fileName, data) {
  // eslint-disable-next-line import/no-dynamic-require
  const template = require(`./templates/${templateId}`);

  const doc = await template.generate(data);
  const stream = doc.pipe(blobStream());

  doc.end();

  stream.on('finish', () => {
    const pdf = stream.toBlob('application/pdf');
    fileSaver.saveAs(pdf, `${fileName}.pdf`);
  });
}
