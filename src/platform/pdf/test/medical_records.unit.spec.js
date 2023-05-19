import { expect } from 'chai';

const getStream = require('get-stream');

// Workaround for pdf.js incompatibility.
// cf. https://github.com/mozilla/pdf.js/issues/15728
const originalPlatform = navigator.platform;
navigator.platform = '';

const pdfjs = require('pdfjs-dist/legacy/build/pdf');

describe('Medical records PDF template', () => {
  const data = require('./fixtures/lab_test_blood_count.json');

  after(() => {
    navigator.platform = originalPlatform;
  });

  const generatePdf = async () => {
    const template = require('../templates/medical_records');

    const doc = await template.generate(data);
    doc.end();
    return getStream.buffer(doc);
  };

  describe('PDF Semantics', () => {
    it('places the title in an H1', async () => {
      const pdfData = await generatePdf();
      const pdf = await pdfjs.getDocument(pdfData).promise;

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });
      const { tag } = content.items[0];
      expect(tag).to.equal('H1');
      const text = content.items[1].str;
      expect(text).to.equal(data.title.substring(0, text.length));
    });
  });
});
