import { expect } from 'chai';

const getStream = require('get-stream');

// Workaround for pdf.js incompatibility.
// cf. https://github.com/mozilla/pdf.js/issues/15728
const originalPlatform = navigator.platform;
navigator.platform = '';

const pdfjs = require('pdfjs-dist/legacy/build/pdf');

describe('Medications PDF template', () => {
  after(() => {
    navigator.platform = originalPlatform;
  });

  const generatePdf = async data => {
    const template = require('../../../templates/medications');

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
      const data = require('./fixtures/medications_list.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });
      const { tag } = content.items[20];
      expect(tag).to.equal('H1');
      const text = content.items[22].str;
      expect(text.length).to.be.gt(0);
      expect(text).to.equal(data.title.substring(0, text.length));
    });

    it('All sections are contained by a root level Document element', async () => {
      const data = require('./fixtures/medications_list.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);
      const structure = await page.getStructTree();
      const rootElement = structure.children[0];

      // There should be one and only one root element.
      expect(structure.children.length).to.equal(1);
      expect(rootElement.role).to.equal('Document');
      expect(rootElement.children.length).to.equal(3);
      expect(rootElement.children[1].children[0].role).to.equal('H1');
    });
  });

  describe('Document section customization', () => {
    it('Shows item details', async () => {
      const data = require('./fixtures/medications_list.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      // Get prescription number
      const { tag } = content.items[92];
      expect(tag).to.equal('P');
      const text = content.items[96].str;
      expect(text).to.equal(data.results[0].list[0].sections[0].items[5].value);
    });

    it('Horizontal rules are added below each item', async () => {
      const data = require('./fixtures/medications_list.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the second page
      const pageNumber = 2;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      // This is the acetic acid medication header
      expect(content.items[99].tag).to.eq('H3');
      expect(content.items[101].str).to.eq('ACETIC ACID 0.25% IRRG SOLN');

      // The two items before it should be the start and end of the Artifact tag.
      expect(content.items[97].type).to.eq('beginMarkedContent');
      expect(content.items[97].tag).to.eq('Artifact');
      expect(content.items[98].type).to.eq('endMarkedContent');
    });

    it('Outputs document sections in the correct order', async () => {
      const data = require('./fixtures/medications_list.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      let headerPosition = 0;
      let titlePosition = 0;
      let resultsPosition = 0;
      let footerPosition = 0;

      for (const [index, item] of content.items.entries()) {
        if (item.str) {
          switch (item.str) {
            case data.headerLeft:
              headerPosition = index;
              break;
            case data.title:
              titlePosition = index;
              break;
            case data.results[0].header:
              resultsPosition = index;
              break;
            case data.footerLeft:
              footerPosition = index;
              break;
            default:
              break;
          }
        }
      }

      expect(headerPosition).to.be.gt(0);
      expect(headerPosition).to.be.lt(titlePosition);
      expect(titlePosition).to.be.lt(resultsPosition);
      expect(resultsPosition).to.be.lt(footerPosition);
    });

    it('Has a default language (english)', async () => {
      const data = require('./fixtures/medications_list.json');
      const { metadata } = await generateAndParsePdf(data);
      expect(metadata.info.Language).to.equal('en-US');
    });

    it('Can customize the document language', async () => {
      const json = require('./fixtures/medications_list.json');
      const data = { ...json, lang: 'en_UK' };
      const { metadata } = await generateAndParsePdf(data);
      expect(metadata.info.Language).to.equal('en_UK');
    });

    it('Provides defaults', async () => {
      const data = require('./fixtures/medications_list.json');
      const { metadata } = await generateAndParsePdf(data);
      expect(metadata.info.Author).to.equal('Department of Veterans Affairs');
      expect(metadata.info.Subject).to.equal('');
    });

    it('Metadata may be customized', async () => {
      const json = require('./fixtures/medications_list.json');
      const data = { ...json, author: 'John Smith' };
      const { metadata } = await generateAndParsePdf(data);
      expect(metadata.info.Author).to.equal(data.author);
      expect(metadata.info.Title).to.equal(data.title);
    });
  });
});
