import { expect } from 'chai';
import sinon from 'sinon';
import * as hooks from '../../hooks/useFindFormsBrowserMonitoring';
import { createLogMessage } from '../../helpers/datadogLogger';

describe('datadogLogger', () => {
  const sandbox = sinon.createSandbox();
  let datadogLoggerStub;

  beforeEach(() => {
    // Mock the DD_LOGS global
    global.window = {
      DD_LOGS: {
        logger: {
          error: sandbox.spy(),
        },
      },
    };

    datadogLoggerStub = sandbox.stub(hooks, 'datadogLogger');
  });

  afterEach(() => {
    sandbox.restore();
    delete global.window;
  });

  describe('datadogLogger', () => {
    it('should call datadogLogger with correct parameters', () => {
      const form = {
        formName: 'VA-10-10EZ',
        attributes: {
          formName: 'VA-10-10EZ',
          url: 'https://example.com/form.pdf',
        },
      };
      const downloadUrl = 'https://example.com/form.pdf';
      const message = 'Test error message';

      hooks.datadogLogger(form, downloadUrl, message);

      expect(datadogLoggerStub.calledOnce).to.be.true;
      expect(datadogLoggerStub.calledWith(form, downloadUrl, message)).to.be
        .true;
    });
  });

  describe('createLogMessage', () => {
    it('should log network request error', () => {
      const form = { formName: 'VA-10-10EZ' };
      const downloadUrl = 'https://example.com/form.pdf';

      createLogMessage({
        downloadUrl,
        form,
        formPdfIsValid: true,
        formPdfUrlIsValid: true,
        networkRequestError: true,
      });

      expect(datadogLoggerStub.calledOnce).to.be.true;
      expect(
        datadogLoggerStub.calledWith(
          form,
          downloadUrl,
          'Find Forms - Form Detail - onDownloadLinkClick function error',
        ),
      ).to.be.true;
    });

    it('should log invalid PDF and invalid PDF link', () => {
      const form = { formName: 'VA-10-10EZ' };
      const downloadUrl = 'https://example.com/form.pdf';

      createLogMessage({
        downloadUrl,
        form,
        formPdfIsValid: false,
        formPdfUrlIsValid: false,
        networkRequestError: false,
      });

      expect(datadogLoggerStub.calledOnce).to.be.true;
      expect(
        datadogLoggerStub.calledWith(
          form,
          downloadUrl,
          'Find Forms - Form Detail - invalid PDF accessed & invalid PDF link',
        ),
      ).to.be.true;
    });

    it('should log invalid PDF link only', () => {
      const form = { formName: 'VA-10-10EZ' };
      const downloadUrl = 'https://example.com/form.pdf';

      createLogMessage({
        downloadUrl,
        form,
        formPdfIsValid: true,
        formPdfUrlIsValid: false,
        networkRequestError: false,
      });

      expect(datadogLoggerStub.calledOnce).to.be.true;
      expect(
        datadogLoggerStub.calledWith(
          form,
          downloadUrl,
          'Find Forms - Form Detail - invalid PDF link',
        ),
      ).to.be.true;
    });
  });
});
