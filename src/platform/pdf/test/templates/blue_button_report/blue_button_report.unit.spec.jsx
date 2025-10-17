import { expect } from 'chai';
import cloneDeep from 'platform/utilities/data/cloneDeep';
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
      const { tag } = content.items[20];
      expect(tag).to.equal('H1');
      const text = content.items[22].str;
      expect(text.length).to.be.gt(0);
      expect(text).to.equal('VA Blue Button® report');
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
      expect(rootElement.children[1].children[0].role).to.equal('H1');
      expect(rootElement.children[2].children[0].role).to.equal('H2');
    });
  });

  describe('Cover page', () => {
    it('Shows the last updated date', async () => {
      const data = require('./fixtures/all_sections.json');
      const { pdf } = await generateAndParsePdf({ data, template });

      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      // Get Last Updated paragraph.
      const recordsItemIndex = content.items.findIndex(
        item => item.str === data.lastUpdated,
      );
      expect(content.items[recordsItemIndex]).to.exist;
      expect(content.items[recordsItemIndex + 2].tag).to.equal('H2');
    });

    it('Displays the Records in this report section', async () => {
      const data = require('./fixtures/all_sections.json');
      const { pdf } = await generateAndParsePdf({ data, template });

      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      // Get Records in this Report section.
      const recordsItemIndex = content.items.findIndex(
        item => item.str === 'Records in this report',
      );
      expect(content.items[recordsItemIndex - 2].tag).to.equal('H2');

      // Get the list of available records.
      const listItemIndex = content.items.findIndex(
        item => item.tag === 'List',
      );
      const endMarkedItemIndex = content.items.findIndex((item, index) => {
        return index > listItemIndex && item.type === 'endMarkedContent';
      });
      // Slice from the list item to the next endMarkedContent item.
      const listItems = content.items.slice(
        listItemIndex + 1,
        endMarkedItemIndex,
      );
      const listItemsText = listItems
        .filter(item => item.str)
        .map(item => item.str);
      expect(listItemsText.length).to.equal(data.recordSets.length);
    });

    it('Displays the Records not in this report section when some sections have no records', async () => {
      const data = cloneDeep(require('./fixtures/all_sections.json'));

      // Mark some sections as having no records.
      data.recordSets[0].records = []; // lab and test results
      data.recordSets[3].records = []; // allergies
      data.recordSets[7].records = []; // appointments

      const { pdf } = await generateAndParsePdf({ data, template });

      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent({ includeMarkedContent: true });

      // Get Records in this Report section.
      const recordsItemIndex = content.items.findIndex(
        item => item.str === 'Records in this report',
      );
      expect(content.items[recordsItemIndex - 2].tag).to.equal('H2');

      // Get the list of available records.
      const listItemIndex = content.items.findIndex(
        item => item.tag === 'List',
      );
      const endMarkedItemIndex = content.items.findIndex((item, index) => {
        return index > listItemIndex && item.type === 'endMarkedContent';
      });
      // Slice from the list item to the next endMarkedContent item.
      const listItems = content.items.slice(
        listItemIndex + 1,
        endMarkedItemIndex,
      );
      const listItemsText = listItems
        .filter(item => item.str)
        .map(item => item.str);
      expect(listItemsText.length).to.equal(data.recordSets.length - 3);

      // Get Records not in this Report section.
      const noRecordsItemIndex = content.items.findIndex(
        item => item.str === 'Records not in this report',
      );
      expect(content.items[noRecordsItemIndex - 2].tag).to.equal('H2');

      // Get the list of unavailable records.
      const unavailableListItemIndex = content.items.findIndex(
        (item, index) => index > noRecordsItemIndex && item.tag === 'List',
      );
      const endUnavailableMarkedItemIndex = content.items.findIndex(
        (item, index) => {
          return (
            index > unavailableListItemIndex && item.type === 'endMarkedContent'
          );
        },
      );
      // Slice from the list item to the next endMarkedContent item.
      const unavailableListItems = content.items.slice(
        unavailableListItemIndex + 1,
        endUnavailableMarkedItemIndex,
      );
      const unavailableListItemsText = unavailableListItems
        .filter(item => item.str)
        .map(item => item.str);
      expect(unavailableListItemsText.length).to.equal(3);
    });
  });

  describe('Document section customization', () => {
    it('Only outputs detail headers when present in JSON', async () => {
      const data = require('./fixtures/all_sections.json');
      const { pdf } = await generateAndParsePdf({ data, template });

      const pageNumber = 2;
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
