import { expect } from 'chai';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import * as recordEventModule from 'platform/monitoring/record-event';
import { fetchPdfApi, downloadBlob, formatPdfFilename } from './pdfDownload';

describe('pdfDownload utilities', () => {
  let sandbox;
  let apiRequestStub;
  let recordEventStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    apiRequestStub = sandbox.stub(api, 'apiRequest');
    recordEventStub = sandbox.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetchPdfApi', () => {
    const mockGuid = '12345678-1234-1234-1234-123456789abc';

    it('should throw error when guid is missing', async () => {
      try {
        await fetchPdfApi(null);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal(
          'Submission GUID is required to download PDF',
        );
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

      const result = await fetchPdfApi(mockGuid);

      expect(result).to.equal(mockBlob);
      expect(apiRequestStub.calledOnce).to.be.true;
      expect(apiRequestStub.getCall(0).args[0]).to.equal(
        `/form210779/download_pdf/${mockGuid}`,
      );
      expect(apiRequestStub.getCall(0).args[1].method).to.equal('GET');
      expect(recordEventStub.calledOnce).to.be.true;
      expect(
        recordEventStub.calledWith({
          event: 'form-21-0779--pdf-download-success',
        }),
      ).to.be.true;
    });

    it('should throw error for non-PDF response', async () => {
      const mockBlob = new Blob(['html content'], { type: 'text/html' });
      const mockResponse = {
        ok: true,
        blob: sandbox.stub().resolves(mockBlob),
      };
      apiRequestStub.resolves(mockResponse);

      try {
        await fetchPdfApi(mockGuid);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Expected PDF but got text/html');
        expect(recordEventStub.calledOnce).to.be.true;
        expect(
          recordEventStub.calledWith({
            event: 'form-21-0779--pdf-download-failure',
            'error-message': error.message,
          }),
        ).to.be.true;
      }
    });

    it('should handle API error response', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      };
      apiRequestStub.resolves(mockResponse);

      try {
        await fetchPdfApi(mockGuid);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Failed to fetch PDF: 500');
        expect(recordEventStub.calledOnce).to.be.true;
        expect(
          recordEventStub.calledWith({
            event: 'form-21-0779--pdf-download-failure',
            'error-message': error.message,
          }),
        ).to.be.true;
      }
    });

    it('should handle network errors', async () => {
      apiRequestStub.rejects(new Error('Network error'));

      try {
        await fetchPdfApi(mockGuid);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal('Network error');
        expect(recordEventStub.calledOnce).to.be.true;
        expect(
          recordEventStub.calledWith({
            event: 'form-21-0779--pdf-download-failure',
            'error-message': 'Network error',
          }),
        ).to.be.true;
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
        first: 'Anakin',
        middle: 'L',
        last: 'Skywalker',
      };

      const result = formatPdfFilename(veteranName);
      expect(result).to.equal('21-0779_Anakin_Skywalker.pdf');
    });

    it('should use default values when name is missing', () => {
      const result = formatPdfFilename({});
      expect(result).to.equal('21-0779_Veteran_Submission.pdf');
    });

    it('should remove special characters from filename', () => {
      const veteranName = {
        first: "Obi-Wan's",
        last: 'Kenobi-Solo',
      };

      const result = formatPdfFilename(veteranName);
      expect(result).to.equal('21-0779_ObiWans_KenobiSolo.pdf');
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
        first: 'Qui-Gon',
        last: 'Jinn',
      };

      const result = formatPdfFilename(veteranName);
      expect(result).to.equal('21-0779_QuiGon_Jinn.pdf');
    });
  });
});
