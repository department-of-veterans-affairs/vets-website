/**
 * Accessible PDF generation
 * @name platform/pdf
 */
import './registerStaticFiles';
import { templates } from './templates/index';
import { UnknownTemplateException } from './utils/exceptions/UnknownTemplateException';

const blobStream = require('blob-stream');
const fileSaver = require('file-saver');

export const generatePdf = async (templateId, fileName, data, openInTab = false) => {
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

    if (openInTab) {
      const newWindow = window.open('/');
      newWindow.location = URL.createObjectURL(pdf);
    } else {
      fileSaver.saveAs(pdf, `${fileName}.pdf`);
    }
  });
};

export const getPdfBlob = async (templateId, data) => {
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
