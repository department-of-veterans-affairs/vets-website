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

  const generatePdf = async (data, config) => {
    const template = require('../../../templates/medical_records');

    const doc = await template.generate(data, config);
    doc.end();
    return getStream.buffer(doc);
  };

  const generateAndParsePdf = async (data, config) => {
    const pdfData = await generatePdf(data, config);
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
      const text = content.items[9].str;
      expect(text.length).to.be.gt(0);
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

    it('Horizontal rules are added below result sections by default', async () => {
      const data = require('./fixtures/result_sections_with_horizontal_rules.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the second page
      const pageNumber = 2;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      // This is the second test result header
      expect(content.items[37].tag).to.eq('H3');
      expect(content.items[39].str).to.eq('RBC');

      // The two items before it should be the start and end of the Artifact tag.
      expect(content.items[35].type).to.eq('beginMarkedContent');
      expect(content.items[35].tag).to.eq('Artifact');
      expect(content.items[36].type).to.eq('endMarkedContent');
    });

    it('Horizontal rules below result sections may be suppressed', async () => {
      const data = require('./fixtures/result_sections_with_no_horizontal_rules.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the second page
      const pageNumber = 2;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      // This is the second test result header
      expect(content.items[35].tag).to.eq('H3');
      expect(content.items[37].str).to.eq('RBC');

      // The item before it should be the end of the last result header.
      expect(content.items[33].str).to.eq('None noted');
      expect(content.items[34].type).to.eq('endMarkedContent');
    });

    it('Outputs document sections in the correct order', async () => {
      const data = require('./fixtures/all_sections.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      let headerPosition = 0;
      let titlePosition = 0;
      let detailsPosition = 0;
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
            case data.details.header:
              detailsPosition = index;
              break;
            case data.results.header:
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
      expect(titlePosition).to.be.lt(detailsPosition);
      expect(detailsPosition).to.be.lt(resultsPosition);
      expect(resultsPosition).to.be.lt(footerPosition);
    });

    it('Special characters are rendered correctly', async () => {
      const data = require('./fixtures/special_characters.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      // This confirms the undesirable behavior that characters without glyphs
      // in the selected font are converted to non-printing characters, validating
      // the next assertions.
      const h1Text = content.items[9].str;
      expect(h1Text.length).to.be.gt(0);
      expect(h1Text).to.contain('Complete \u0000 count on');

      // This confirms that characters like ', É, and ã are shown in the PDF.
      const headerText = content.items[1].str;
      expect(headerText.length).to.be.gt(0);
      expect(headerText).to.eq(data.headerLeft);
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

    it('Can opt for results to be in monospace font', async () => {
      const data = require('./fixtures/monospace_result.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      // This code represents the font in the content items
      // It is something like g_d3_f5
      const monospaceFontCode = Object.keys(content.styles).find(
        key => content.styles[key].fontFamily === 'monospace',
      );

      const monospaceStartItemIndex = 81;
      const monospaceEndItemIndex = 162;
      const monospaceItems = content.items.slice(
        monospaceStartItemIndex,
        monospaceEndItemIndex + 1,
      );
      const allMonoSpaceItemsUseMonospaceFont = monospaceItems.every(
        item => item.fontName === monospaceFontCode,
      );

      expect(allMonoSpaceItemsUseMonospaceFont).to.eq(true);
    });

    it('Can opt for results to be in monospace font but fallback to text font if no monospace font specified', async () => {
      const config = {
        margins: {
          top: 40,
          bottom: 40,
          left: 20,
          right: 20,
        },
        headings: {
          H1: {
            font: 'Bitter-Bold',
            size: 24,
          },
          H2: {
            font: 'Bitter-Bold',
            size: 18,
          },
          H3: {
            font: 'Bitter-Bold',
            size: 16,
          },
        },
        subHeading: {
          font: 'Bitter-Regular',
          size: 12,
        },
        text: {
          boldFont: 'SourceSansPro-Bold',
          font: 'SourceSansPro-Regular',
          size: 12,
        },
      };

      const data = require('./fixtures/monospace_result.json');
      const { pdf } = await generateAndParsePdf(data, config);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      // This code represents the font in the content items
      // It is something like g_d3_f5
      const textFontCode = Object.keys(content.styles).find(
        key => content.styles[key].fontFamily === 'sans-serif',
      );

      // The number of indexes is less for the this font than the monospace font test above
      // because the use of the monospace font breaks the text up into more content items.
      const monospaceStartItemIndex = 81;
      const monospaceEndItemIndex = 98;
      const monospaceItems = content.items.slice(
        monospaceStartItemIndex,
        monospaceEndItemIndex + 1,
      );
      const allMonoSpaceItemsUseMonospaceFont = monospaceItems.every(
        item => item.fontName === textFontCode,
      );

      expect(allMonoSpaceItemsUseMonospaceFont).to.eq(true);
    });
  });
});
