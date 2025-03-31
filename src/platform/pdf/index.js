import './registerStaticFiles';
import { templates } from './templates/index';
import { UnknownTemplateException } from './utils/exceptions/UnknownTemplateException';

const fileSaver = require('file-saver');

const generatePdf = async (templateId, fileName, data, openInTab = false) => {
  console.log('Starting generatePdf for template:', templateId);
  let template;

  try {
    template = templates[templateId]();
  } catch (e) {
    console.error('Template lookup failed:', e);
    throw new UnknownTemplateException(templateId);
  }

  console.log('Generating doc...');
  const doc = await template.generate(data);
  console.log('Doc generated');

  const chunks = [];
  doc.on('data', (chunk) => {
    console.log('Received data chunk, length:', chunk.length);
    chunks.push(chunk);
  });

  doc.on('end', () => {
    console.log('Doc stream ended');
    const pdfBuffer = Buffer.concat(chunks);
    console.log('PDF buffer created, length:', pdfBuffer.length);
    const pdf = new Blob([pdfBuffer], { type: 'application/pdf' });

    if (openInTab) {
      const newWindow = window.open('/');
      newWindow.location = URL.createObjectURL(pdf);
    } else {
      fileSaver.saveAs(pdf, `${fileName}.pdf`);
    }
    console.log('PDF download triggered');
  });

  doc.on('error', (err) => {
    console.error('Doc stream error:', err);
  });

  console.log('Ending doc stream...');
  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      console.log('Promise resolved');
      resolve();
    });
    doc.on('error', (err) => {
      console.error('Promise rejected:', err);
      reject(err);
    });
    // Timeout to catch if the end event doesn't fire
    setTimeout(() => {
      if (chunks.length === 0) {
        console.error('Timeout: Doc stream did not end after 5 seconds');
        reject(new Error('Doc stream did not end'));
      }
    }, 5000);
  });
};

export { generatePdf };