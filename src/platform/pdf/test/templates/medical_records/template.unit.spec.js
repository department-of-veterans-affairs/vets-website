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
    const template = require('../../../templates/medical_records');

    const doc = await template.generate(data);
    doc.end();
    return getStream.buffer(doc);
  };

  const generateAndParsePdf = async data => {
    const pdfData = await generatePdf(data);
    const pdf = await pdfjs.getDocument(pdfData).promise;
    const metadata = await pdf.getMetadata();

    return { metadata, pdf };
  };

  describe('PDF Semantics', () => {
    it('places the title in an H1', async () => {
      const data = require('./fixtures/lab_test_blood_count.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });
      const { tag } = content.items[7];
      expect(tag).to.equal('H1');
      const text = content.items[8].str;
      expect(text).to.equal(data.title.substring(0, text.length));
    });

    it('All sections are contained by a root level Document element', async () => {
      const data = require('./fixtures/single_vital.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);
      const structure = await page.getStructTree();
      const rootElement = structure.children[0];

      // There should be one and only one root element.
      expect(structure.children.length).to.equal(1);
      expect(rootElement.role).to.equal('Document');
      expect(rootElement.children.length).to.equal(4);
      expect(rootElement.children[1].children[0].role).to.equal('H1');
    });
  });

  describe('Document section customization', () => {
    it('Only outputs detail headers when present in JSON', async () => {
      const data = require('./fixtures/single_vital.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      // Get first details struct.
      const { tag } = content.items[17];
      expect(tag).to.equal('P');
      const text = content.items[21].str;
      expect(text).to.equal(data.results.items[0].items[0].value);
    });

    it('Has a default language (english)', async () => {
      const data = require('./fixtures/single_vital.json');
      const { metadata } = await generateAndParsePdf(data);
      expect(metadata.info.Language).to.equal('en-US');
    });

    it('Can customize the document language', async () => {
      const data = require('./fixtures/single_vital_es.json');
      const { metadata } = await generateAndParsePdf(data);
      expect(metadata.info.Language).to.equal(data.lang);
    });

    it('Provides defaults', async () => {
      const data = require('./fixtures/single_vital.json');
      const { metadata } = await generateAndParsePdf(data);
      expect(metadata.info.Author).to.equal('Department of Veterans Affairs');
      expect(metadata.info.Subject).to.equal('');
    });

    it('Metadata may be customized', async () => {
      const data = require('./fixtures/single_vital_custom_metadata.json');
      const { metadata } = await generateAndParsePdf(data);
      expect(metadata.info.Author).to.equal(data.author);
      expect(metadata.info.Subject).to.equal(data.subject);
      expect(metadata.info.Title).to.equal(data.title);
    });
  });
});
