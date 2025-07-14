import { expect } from 'chai';
import cloneDeep from 'platform/utilities/data/cloneDeep';

const getStream = require('get-stream');

// Workaround for pdf.js incompatibility.
// cf. https://github.com/mozilla/pdf.js/issues/15728
const originalPlatform = navigator.platform;
navigator.platform = '';

const pdfjs = require('pdfjs-dist/legacy/build/pdf');

describe('Blue Button report PDF template', () => {
  after(() => {
    navigator.platform = originalPlatform;
  });

  const generatePdf = async data => {
    const template = require('../../../templates/blue_button_report');

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
      const data = require('./fixtures/all_sections.json');
      const { pdf } = await generateAndParsePdf(data);

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
      expect(rootElement.children[2].children[0].role).to.equal('H2');
    });
  });

  describe('Cover page', () => {
    it('Shows the last updated date', async () => {
      const data = require('./fixtures/all_sections.json');
      const { pdf } = await generateAndParsePdf(data);

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
      const { pdf } = await generateAndParsePdf(data);

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
      let recordSetsLength = data.recordSets.length;
      const hasBothAppointmentTypes = data.recordSets.some(
        item =>
          item.type === 'appointments' &&
          item.records.length === 2 &&
          item.records.every(type => type.results.items.length),
      );
      if (hasBothAppointmentTypes) recordSetsLength += 1;
      expect(listItemsText.length).to.equal(recordSetsLength);
    });

    it('Displays the Records not in this report section when some sections have no records', async () => {
      const data = cloneDeep(require('./fixtures/all_sections.json'));

      // Mark some sections as having no records.
      data.recordSets[0].records = []; // lab and test results
      data.recordSets[3].records = []; // allergies
      data.recordSets[7].records = [
        { title: 'Past appointments', results: { items: [] } },
        { title: 'Upcoming appointments', results: { items: [] } },
      ]; // appointments

      const { pdf } = await generateAndParsePdf(data);

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
      expect(unavailableListItemsText.length).to.equal(4);
    });

    it("Displays the Information we can't access right now section when some domains fail", async () => {
      const data = cloneDeep(require('./fixtures/all_sections.json'));
      // simulate domains we couldn’t fetch
      data.failedDomains = ['Lab and test results', 'VA appointments'];

      const { pdf } = await generateAndParsePdf(data);
      const page = await pdf.getPage(1);
      const content = await page.getTextContent({ includeMarkedContent: true });

      // find the H2 for the failed-records section
      const headingIndex = content.items.findIndex(
        item => item.str === "Information we can't access right now",
      );
      expect(content.items[headingIndex - 2].tag).to.equal('H2');

      // grab the bullet list under that heading
      const listStart = content.items.findIndex(
        (item, idx) => idx > headingIndex && item.tag === 'List',
      );
      const listEnd = content.items.findIndex(
        (item, idx) => idx > listStart && item.type === 'endMarkedContent',
      );
      const failedList = content.items
        .slice(listStart + 1, listEnd)
        .filter(i => i.str)
        .map(i => i.str);

      // Expect "Lab and test results" plus past/upcoming appointments
      expect(failedList).to.include('Lab and test results');
      expect(failedList).to.include('Past appointments');
      expect(failedList).to.include('Upcoming appointments');
      expect(failedList.length).to.equal(3);
    });

    it('includes demographics in the "Records not in this report" list when it has no records and hasn’t failed', async () => {
      const data = cloneDeep(require('./fixtures/all_sections.json'));
      // zero‐out demographics
      const demoSet = data.recordSets.find(r => r.type === 'demographics');
      demoSet.records = [];
      data.failedDomains = []; // ensure no failures

      const { pdf } = await generateAndParsePdf(data);
      const page = await pdf.getPage(1);
      const content = await page.getTextContent({ includeMarkedContent: true });

      // locate the empty‐records list
      const noRecIdx = content.items.findIndex(
        item => item.str === 'Records not in this report',
      );
      const listStart = content.items.findIndex(
        (item, i) => i > noRecIdx && item.tag === 'List',
      );
      const listEnd = content.items.findIndex(
        (item, i) => i > listStart && item.type === 'endMarkedContent',
      );
      const emptyTitles = content.items
        .slice(listStart + 1, listEnd)
        .filter(i => i.str)
        .map(i => i.str);

      expect(emptyTitles).to.include(demoSet.title);
    });

    it('moves demographics into the failed list when "VA demographics records" is in failedDomains', async () => {
      const data = cloneDeep(require('./fixtures/all_sections.json'));
      // zero‐out demographics
      const demoSet = data.recordSets.find(r => r.type === 'demographics');
      demoSet.records = [];
      data.failedDomains = ['VA demographics records'];

      const { pdf } = await generateAndParsePdf(data);
      const page = await pdf.getPage(1);
      const content = await page.getTextContent({ includeMarkedContent: true });

      // it should no longer appear in the empty‐records list
      const noRecIdx = content.items.findIndex(
        item => item.str === 'Records not in this report',
      );
      const listStart = content.items.findIndex(
        (item, i) => i > noRecIdx && item.tag === 'List',
      );
      const listEnd = content.items.findIndex(
        (item, i) => i > listStart && item.type === 'endMarkedContent',
      );
      const emptyTitles = content.items
        .slice(listStart + 1, listEnd)
        .filter(i => i.str)
        .map(i => i.str);
      expect(emptyTitles).to.not.include(demoSet.title);

      // and it should show up under the failed‐domains section
      const failHeading = content.items.findIndex(
        item => item.str === "Information we can't access right now",
      );
      const failListStart = content.items.findIndex(
        (item, i) => i > failHeading && item.tag === 'List',
      );
      const failListEnd = content.items.findIndex(
        (item, i) => i > failListStart && item.type === 'endMarkedContent',
      );
      const failedTitles = content.items
        .slice(failListStart + 1, failListEnd)
        .filter(i => i.str)
        .map(i => i.str);
      expect(failedTitles).to.include('VA demographics records');
    });
  });

  describe('Document section customization', () => {
    it('Only outputs detail headers when present in JSON', async () => {
      const data = require('./fixtures/all_sections.json');
      const { pdf } = await generateAndParsePdf(data);

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
