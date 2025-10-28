// Testing a fix to accomodate
(() => {
  try {
    const originalNavigator = globalThis.navigator;

    // If it doesn't already return the expected platform string,
    // or if it's not configurable, redefine it.
    const desc = Object.getOwnPropertyDescriptor(originalNavigator, 'platform');
    if (!desc || !desc.configurable) {
      Object.defineProperty(globalThis, 'navigator', {
        value: Object.create(originalNavigator, {
          platform: { get: () => 'MacIntel' },
        }),
        configurable: true,
      });
    }
  } catch (err) {
    // Swallow errors if navigator isn't defined in this context.
    // This helper is meant to run in Node test environments only.
  }
})();

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
