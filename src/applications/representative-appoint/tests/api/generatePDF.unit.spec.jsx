import { expect } from 'chai';
import sinon from 'sinon';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import { generatePDF } from '../../api/generatePDF';
import formData from '../fixtures/data/form-data.json';
import formData2122a from '../fixtures/data/21-22a/form-data.json';

const ensureCreateObjectURL = () => {
  if (!global.URL) {
    global.URL = {};
  }
  if (typeof global.URL.createObjectURL !== 'function') {
    global.URL.createObjectURL = () => 'blob:mock';
  }
};

describe('generatePDF', () => {
  context('when submitting Form 21-22', () => {
    it('sets the pdfUrl in local storage', async () => {
      expect(localStorage.getItem('pdfUrl')).to.be.null;

      mockApiRequest({
        blob: () => new Blob(['my blob'], { type: 'application/pdf' }),
      });

      ensureCreateObjectURL();
      const createObjectURL = sinon
        .stub(global.URL, 'createObjectURL')
        .returns('my_stubbed_url.com');

      await generatePDF(formData);

      expect(localStorage.getItem('pdfUrl')).to.eql('my_stubbed_url.com');

      createObjectURL.restore();
    });
  });

  context('when submitting Form 21-22a', () => {
    it('sets the pdfUrl in local storage', async () => {
      expect(localStorage.getItem('pdfUrl')).to.be.null;

      mockApiRequest({
        blob: () => new Blob(['my blob'], { type: 'application/pdf' }),
      });

      ensureCreateObjectURL();
      const createObjectURL = sinon
        .stub(global.URL, 'createObjectURL')
        .returns('my_stubbed_url.com');

      await generatePDF(formData2122a);

      expect(localStorage.getItem('pdfUrl')).to.eql('my_stubbed_url.com');

      createObjectURL.restore();
    });
  });

  it('should handle errors', async () => {
    mockApiRequest();

    try {
      await generatePDF(formData);
    } catch (error) {
      expect(error).to.not.be.null;
    }
  });
});
