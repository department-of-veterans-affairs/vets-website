import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
import * as api from 'platform/utilities/api';
import {
  ensureValidCSRFToken,
  fetchPdfApi,
  downloadBlob,
  formatPdfFilename,
} from './pdfDownload';

describe('pdfDownload utilities', () => {
  let sandbox;
  let apiRequestStub;
  let sentryStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    apiRequestStub = sandbox.stub(api, 'apiRequest');
    sentryStub = {
      withScope: sandbox.stub(Sentry, 'withScope').callsFake(callback => {
        const mockScope = {
          setExtra: sinon.stub(),
        };
        callback(mockScope);
      }),
      captureMessage: sandbox.stub(Sentry, 'captureMessage'),
    };
  });

  afterEach(() => {
    sandbox.restore();
    localStorage.clear();
  });

  describe('ensureValidCSRFToken', () => {
    it('should not fetch token if one exists in localStorage', async () => {
      localStorage.setItem('csrfToken', 'existing-token');

      await ensureValidCSRFToken('test-label');

      expect(apiRequestStub.called).to.be.false;
    });

    it('should fetch token if none exists', async () => {
      apiRequestStub.resolves({ ok: true });

      await ensureValidCSRFToken('test-label');

      expect(apiRequestStub.calledOnce).to.be.true;
      expect(apiRequestStub.getCall(0).args[0]).to.include('csrf_token');
      expect(apiRequestStub.getCall(0).args[1]).to.deep.equal({
        method: 'HEAD',
      });
    });

    it('should record failure event if token fetch fails', async () => {
      apiRequestStub.rejects(new Error('Network error'));

      try {
        await ensureValidCSRFToken('test-label');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal('Network error');
      }
    });
  });

  describe('fetchPdfApi', () => {
    beforeEach(() => {
      localStorage.setItem('csrfToken', 'test-token');
    });

    it('should throw error when form data is missing', async () => {
      try {
        await fetchPdfApi(null);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal('Form data is required to download PDF');
        expect(apiRequestStub.called).to.be.false;
      }
    });

    it('should successfully fetch PDF blob', async () => {
      const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' });
      const mockResponse = {
        ok: true,
        blob: sandbox.stub().resolves(mockBlob),
      };
      apiRequestStub.resolves(mockResponse);

      const mockFormData = JSON.stringify({
        veteranPersonalInfo: { fullName: { first: 'John', last: 'Doe' } },
      });
      const result = await fetchPdfApi(mockFormData);

      expect(result).to.equal(mockBlob);
      expect(apiRequestStub.calledOnce).to.be.true;
      expect(apiRequestStub.getCall(0).args[0]).to.include(
        '/form210779/download_pdf',
      );
      expect(apiRequestStub.getCall(0).args[1].method).to.equal('POST');
      expect(apiRequestStub.getCall(0).args[1].body).to.equal(
        JSON.stringify({ form: mockFormData }),
      );
      expect(
        apiRequestStub.getCall(0).args[1].headers['Content-Type'],
      ).to.equal('application/json');
    });

    it('should throw error for non-PDF response', async () => {
      const mockBlob = new Blob(['html content'], { type: 'text/html' });
      const mockResponse = {
        ok: true,
        blob: sandbox.stub().resolves(mockBlob),
      };
      apiRequestStub.resolves(mockResponse);

      const mockFormData = JSON.stringify({ test: 'data' });

      try {
        await fetchPdfApi(mockFormData);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Expected PDF but got text/html');
      }
    });

    it('should handle API error response', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      };
      apiRequestStub.resolves(mockResponse);

      const mockFormData = JSON.stringify({ test: 'data' });

      try {
        await fetchPdfApi(mockFormData);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Failed to fetch PDF: 500');
        expect(sentryStub.withScope.calledOnce).to.be.true;
        expect(
          sentryStub.captureMessage.calledWith(
            'PDF download failed for 21-0779',
          ),
        ).to.be.true;
      }
    });

    it('should handle network errors', async () => {
      apiRequestStub.rejects(new Error('Network error'));

      const mockFormData = JSON.stringify({ test: 'data' });

      try {
        await fetchPdfApi(mockFormData);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal('Network error');
      }
    });
  });

  describe('downloadBlob', () => {
    let createElementStub;
    let appendChildStub;
    let removeChildStub;
    let createObjectURLStub;
    let revokeObjectURLStub;
    let clickStub;

    beforeEach(() => {
      const linkElement = document.createElement('a');
      clickStub = sandbox.stub(linkElement, 'click');

      createElementStub = sandbox
        .stub(document, 'createElement')
        .returns(linkElement);
      appendChildStub = sandbox.stub(document.body, 'appendChild');
      removeChildStub = sandbox.stub(document.body, 'removeChild');

      // Ensure window.URL exists with the required methods
      if (!window.URL) {
        window.URL = {};
      }
      if (!window.URL.createObjectURL) {
        window.URL.createObjectURL = () => {};
      }
      if (!window.URL.revokeObjectURL) {
        window.URL.revokeObjectURL = () => {};
      }

      createObjectURLStub = sandbox
        .stub(window.URL, 'createObjectURL')
        .returns('blob:mock-url');
      revokeObjectURLStub = sandbox.stub(window.URL, 'revokeObjectURL');
    });

    it('should trigger download with correct filename', () => {
      const mockBlob = new Blob(['content']);
      const filename = 'test.pdf';

      downloadBlob(mockBlob, filename);

      expect(createElementStub.calledWith('a')).to.be.true;
      expect(createObjectURLStub.calledWith(mockBlob)).to.be.true;
      expect(clickStub.calledOnce).to.be.true;
      expect(appendChildStub.calledOnce).to.be.true;
      expect(removeChildStub.calledOnce).to.be.true;
      expect(revokeObjectURLStub.calledWith('blob:mock-url')).to.be.true;

      const linkElement = createElementStub.getCall(0).returnValue;
      expect(linkElement.href).to.equal('blob:mock-url');
      expect(linkElement.download).to.equal(filename);
    });
  });

  describe('formatPdfFilename', () => {
    it('should format filename with veteran name', () => {
      const veteranName = {
        first: 'John',
        middle: 'A',
        last: 'Doe',
      };

      const result = formatPdfFilename(veteranName);
      expect(result).to.equal('21-0779_John_Doe.pdf');
    });

    it('should use default values when name is missing', () => {
      const result = formatPdfFilename({});
      expect(result).to.equal('21-0779_Veteran_Submission.pdf');
    });

    it('should remove special characters from filename', () => {
      const veteranName = {
        first: "John-Paul's",
        last: "O'Brien-Smith",
      };

      const result = formatPdfFilename(veteranName);
      expect(result).to.equal('21-0779_JohnPauls_OBrienSmith.pdf');
    });

    it('should handle null veteran name', () => {
      const result = formatPdfFilename(null);
      expect(result).to.equal('21-0779_Veteran_Submission.pdf');
    });

    it('should handle undefined veteran name', () => {
      const result = formatPdfFilename(undefined);
      expect(result).to.equal('21-0779_Veteran_Submission.pdf');
    });

    it('should handle names with spaces', () => {
      const veteranName = {
        first: 'Mary Jane',
        last: 'Van Der Berg',
      };

      const result = formatPdfFilename(veteranName);
      expect(result).to.equal('21-0779_MaryJane_VanDerBerg.pdf');
    });
  });
});
