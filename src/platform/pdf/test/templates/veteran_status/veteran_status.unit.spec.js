import { expect } from 'chai';

const getStream = require('get-stream');

// Workaround for pdf.js incompatibility.
// cf. https://github.com/mozilla/pdf.js/issues/15728
const originalPlatform = navigator.platform;
navigator.platform = '';

const pdfjs = require('pdfjs-dist/legacy/build/pdf');

describe('Veteran Status PDF template', () => {
  after(() => {
    navigator.platform = originalPlatform;
  });

  const generatePdf = async data => {
    const template = require('../../../templates/veteran_status');

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
    it('places the name in an H1', async () => {
      const data = require('./fixtures/veteran_status.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });
      expect(content.items.filter(item => item.tag === 'H1').length).to.eq(1);
      expect(content.items[3].str).to.eq(data.details.fullName);
      // H1 in this case is set to 14 px
      expect(content.items[3].height).to.eq(14);
    });

    it('All sections are contained by a root level Document element', async () => {
      const data = require('./fixtures/veteran_status.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);
      const structure = await page.getStructTree();
      const rootElement = structure.children[0];

      // There should be one and only one root element.
      expect(structure.children.length).to.equal(1);
      expect(rootElement.role).to.equal('Document');
    });
  });

  describe('Document section customization', () => {
    it('Shows service details', async () => {
      const data = require('./fixtures/veteran_status.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });
      const listContent = content.items.filter(
        item => item.str === 'Period of service',
      );
      expect(listContent.length).to.eq(1);
      const airForceText = content.items.filter(
        item =>
          item.str === `${data.details.serviceHistory[0].branchOfService}`,
      );
      expect(airForceText.length).to.eq(1);
      const armyText = content.items.filter(
        item =>
          item.str === `${data.details.serviceHistory[1].branchOfService}`,
      );
      expect(armyText.length).to.eq(1);
    });

    it('Should only show the 2 most recent periods of service', async () => {
      const data = require('./fixtures/veteran_status.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      const listItems = content.items.filter(item => item.tag === 'Lbl');
      expect(listItems.length).to.eq(2);

      const navyService = content.items.filter(
        item =>
          item.str === `${data.details.serviceHistory[2].branchOfService}`,
      );
      expect(navyService.length).to.eq(0);
    });

    it('Shows disability rating details', async () => {
      const data = require('./fixtures/veteran_status.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });
      const ratingText = content.items.filter(
        item => item.str === 'Disability rating:',
      );
      expect(ratingText.length).to.eq(1);
      const ratingContent = content.items.filter(
        item =>
          item.str ===
          `${data.details.totalDisabilityRating.toString()}% service connected`,
      );
      expect(ratingContent.length).to.eq(1);
    });

    it('Shows date of birth', async () => {
      const data = require('./fixtures/veteran_status.json');
      const { pdf } = await generateAndParsePdf(data);

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });
      const dobTitle = content.items.filter(
        item => item.str === 'Date of birth:',
      );
      expect(dobTitle.length).to.eq(1);
      const dob = content.items.filter(item => item.str === data.details.dob);
      expect(dob.length).to.eq(1);
    });

    it('Has a default language (english)', async () => {
      const data = require('./fixtures/veteran_status.json');
      const { metadata } = await generateAndParsePdf(data);
      expect(metadata.info.Language).to.equal('en-US');
    });

    it('Can customize the document language', async () => {
      const json = require('./fixtures/veteran_status.json');
      const data = { ...json, lang: 'en_UK' };
      const { metadata } = await generateAndParsePdf(data);
      expect(metadata.info.Language).to.equal('en_UK');
    });

    it('Provides defaults', async () => {
      const data = require('./fixtures/veteran_status.json');
      const { metadata } = await generateAndParsePdf(data);
      expect(metadata.info.Author).to.equal('Department of Veterans Affairs');
      expect(metadata.info.Subject).to.equal('');
    });

    it('Metadata may be customized', async () => {
      const json = require('./fixtures/veteran_status.json');
      const data = { ...json, author: 'John Smith' };
      const { metadata } = await generateAndParsePdf(data);
      expect(metadata.info.Author).to.equal(data.author);
      expect(metadata.info.Title).to.equal(data.title);
    });
  });
});
