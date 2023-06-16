/**
 * Accessible PDF generation
 * @name platform/pdf
 */
import './registerStaticFiles';
import { templates } from './templates/index';
import { UnknownTemplateException } from './utils/exceptions/UnknownTemplateException';

const blobStream = require('blob-stream');
const fileSaver = require('file-saver');

const generatePdf = async (templateId, fileName, data) => {
  let template;

  try {
    template = templates[templateId]();
  } catch (e) {
    throw new UnknownTemplateException(templateId);
  }

  const doc = await template.generate(data);
  const stream = doc.pipe(blobStream());

  doc.end();

  stream.on('finish', () => {
    const pdf = stream.toBlob('application/pdf');
    fileSaver.saveAs(pdf, `${fileName}.pdf`);
  });
};

export { generatePdf };
