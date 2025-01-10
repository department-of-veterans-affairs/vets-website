import { expect } from 'chai';
import { generateAndParsePdf } from '../../helpers';

describe('Blue Button report PDF template', () => {
  const template = require('../../../templates/blue_button_report');

  describe('PDF Semantics', () => {
    it('places the title in an H1', async () => {
      const data = require('./fixtures/all_sections.json');
      const { pdf } = await generateAndParsePdf({ data, template });

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });
      const { tag } = content.items[0];
      expect(tag).to.equal('H1');
      const text = content.items[5].str;
      expect(text.length).to.be.gt(0);
      expect(text).to.equal(
        'This report includes key information from your VA medical records.',
      );
    });

    it('All sections are contained by a root level Document element', async () => {
      const data = require('./fixtures/all_sections.json');
      const { pdf } = await generateAndParsePdf({ data, template });

      // Fetch the first page
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);
      const structure = await page.getStructTree();
      const rootElement = structure.children[0];

      // There should be one and only one root element.
      expect(structure.children.length).to.equal(1);
      expect(rootElement.role).to.equal('Document');
      expect(rootElement.children.length).to.equal(3);
      expect(rootElement.children[1].children[0].role).to.equal('H2');
    });
  });

  describe('Document section customization', () => {
    it('Only outputs detail headers when present in JSON', async () => {
      const data = require('./fixtures/all_sections.json');
      const { pdf } = await generateAndParsePdf({ data, template });

      // Fetch the first page
      const pageNumber = 3;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      // Get first details struct.
      const itemIndex = content.items.findIndex(
        item => item.str === 'Details about this test',
      );
      expect(content.items[itemIndex - 2].tag).to.equal('H4');
      const text = content.items[itemIndex].str;
      expect(text).to.equal('Details about this test');
    });
  });
});
