import getStream from 'get-stream';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf';
// import fs from 'fs';
// import path from 'path';

const generatePdf = async ({ data, config, template }) => {
  const doc = await template.generate(data, config);
  doc.end();
  return getStream.buffer(doc);
};

export const generateAndParsePdf = async ({ data, config, template }) => {
  const pdfData = await generatePdf({ data, config, template });

  // Uncomment this line to save the pdf to disk for debugging purposes.
  // fs.writeFileSync(path.join(__dirname, 'test.pdf'), pdfData);

  const uint8Array = new Uint8Array(pdfData);
  const pdf = await getDocument(uint8Array).promise;
  const metadata = await pdf.getMetadata();

  return { metadata, pdf };
};
