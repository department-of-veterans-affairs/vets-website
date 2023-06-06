import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import generatePdf from '@department-of-veterans-affairs/platform-pdf';
import sinon from 'sinon';

chai.use(chaiAsPromised);
const fileSaver = require('file-saver');

const { expect } = chai;

describe('PDF generation API', () => {
  before(() => {
    sinon.stub(fileSaver, 'saveAs').returns('foo');
  });

  describe('Template selection', () => {
    it('Existing template can be used', async () => {
      const data = require('./templates/medical_records/fixtures/lab_test_blood_count.json');

      await expect(generatePdf('medical_records', 'file_name', data)).to.be
        .fulfilled;
    });

    it('An error is thrown for a non-existent template', async () => {
      await expect(
        generatePdf('some_name_that_will_never_exist', 'file_name', {}),
      ).to.be.rejectedWith(Error, /^Cannot find module/);
    });
  });
});
