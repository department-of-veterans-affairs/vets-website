import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { generatePdf } from '../index';

chai.use(chaiAsPromised);
const fileSaver = require('file-saver');

const { expect } = chai;

// Workaround for pdf.js incompatibility.
// cf. https://github.com/mozilla/pdf.js/issues/15728
const originalPlatform = navigator.platform;
navigator.platform = '';

const pdfjs = require('pdfjs-dist/legacy/build/pdf');

let fileSaverMock = {};

/**
 * Convert Blob to ArrayBuffer
 *
 * @param {Blob} blob
 * @returns {ArrayBuffer}
 */
const blobToArrayBuffer = blob => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsArrayBuffer(blob);
  });
};

describe('PDF generation API', () => {
  before(() => {
    fileSaverMock = sinon.stub(fileSaver, 'saveAs').returns('foo');
  });
  after(() => {
    navigator.platform = originalPlatform;
  });

  describe('Template selection', () => {
    it('Existing template can be used', async () => {
      const data = require('./templates/medical_records/fixtures/lab_test_blood_count.json');

      await expect(generatePdf('medicalRecords', 'file_name', data)).to.be
        .fulfilled;
    });

    it('An error is thrown for a non-existent template', async () => {
      const templateId = 'some_name_that_will_never_exist';
      await expect(generatePdf(templateId, 'file_name', {})).to.be.rejectedWith(
        Error,
        `No template was found for id ${templateId}.`,
      );
    });
  });

  describe('End to end', () => {
    /**
     * This is not a true end-to-end test since we are not verifying behavior
     * in the browser, but this confirms that the data passed to the fileSaver
     * package:
     *
     * - is a valid, parseable PDF
     * - has expected metadata
     * - is creating the header content with the correct semantic tag
     */
    it('Valid PDFs are generated', async () => {
      const data = require('./templates/medical_records/fixtures/lab_test_blood_count.json');

      await generatePdf('medicalRecords', 'file_name', data);
      await waitFor(() => expect(fileSaverMock.called).to.be.true);

      const pdfBlob = fileSaverMock.firstCall.args[0];
      const pdfData = await blobToArrayBuffer(pdfBlob);

      // For testing purposes, you may import fs and uncomment
      // the following line to write the generated PDF file.
      // fs.writeFileSync('/tmp/test.pdf', Buffer.from(pdfData));

      const pdf = await pdfjs.getDocument(pdfData).promise;
      const metadata = await pdf.getMetadata();

      expect(metadata.info.PDFFormatVersion).to.eq('1.7');
      expect(metadata.info.Title).to.eq(data.title);

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
  });
});
