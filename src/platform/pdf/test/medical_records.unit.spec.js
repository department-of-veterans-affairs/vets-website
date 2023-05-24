import { expect } from 'chai';

const getStream = require('get-stream');

// Workaround for pdf.js incompatibility.
// cf. https://github.com/mozilla/pdf.js/issues/15728
const originalPlatform = navigator.platform;
navigator.platform = '';

const pdfjs = require('pdfjs-dist/legacy/build/pdf');

describe('Medical records PDF template', () => {
  after(() => {
    navigator.platform = originalPlatform;
  });

  const generatePdf = async data => {
    const template = require('../templates/medical_records');

    const doc = await template.generate(data);
    doc.end();
    return getStream.buffer(doc);
  };

  describe('PDF Semantics', () => {
    it('places the title in an H1', async () => {
      const data = require('./fixtures/lab_test_blood_count.json');

      const pdfData = await generatePdf(data);
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

    it('Only outputs detail headers when present in JSON', async () => {
      const data = require('./fixtures/single_vital.json');
      const pdfData = await generatePdf(data);
      const pdf = await pdfjs.getDocument(pdfData).promise;

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      // Get first details struct.
      const { tag } = content.items[11];
      expect(tag).to.equal('P');
      const text = content.items[15].str;
      expect(text).to.equal(data.results.items[0].items[0].value);
    });
  });
});
