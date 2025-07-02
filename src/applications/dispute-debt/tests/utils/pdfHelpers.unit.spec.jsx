import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
import { handlePdfGeneration } from '../../utils/pdfHelpers';

describe('pdfHelpers', () => {
  describe('handlePdfGeneration', () => {
    let sandbox;
    let sentryScope;
    let sentryCaptureMessage;

    beforeEach(() => {
      sandbox = sinon.createSandbox();

      // Mock Sentry
      sentryScope = {
        setExtra: sandbox.stub(),
      };
      sentryCaptureMessage = sandbox.stub();
      sandbox.stub(Sentry, 'withScope').callsFake(callback => {
        callback(sentryScope);
      });
      sandbox.stub(Sentry, 'captureMessage').callsFake(sentryCaptureMessage);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('is a function', () => {
      expect(handlePdfGeneration).to.be.a('function');
    });

    it('returns null when passed null and logs to Sentry', async () => {
      const result = await handlePdfGeneration(null);

      expect(result).to.be.null;
      expect(sentryScope.setExtra.calledOnce).to.be.true;
      expect(sentryCaptureMessage.calledOnce).to.be.true;
      expect(sentryCaptureMessage.firstCall.args[0]).to.include(
        'PDF - generation failed',
      );
    });

    it('returns null when passed empty object and logs to Sentry', async () => {
      const result = await handlePdfGeneration({});

      expect(result).to.be.null;
      expect(sentryScope.setExtra.calledOnce).to.be.true;
      expect(sentryCaptureMessage.calledOnce).to.be.true;
    });

    it('returns null when passed object without education or compAndPen and logs to Sentry', async () => {
      const result = await handlePdfGeneration({ someOtherProp: 'value' });

      expect(result).to.be.null;
      expect(sentryScope.setExtra.calledOnce).to.be.true;
      expect(sentryCaptureMessage.calledOnce).to.be.true;
    });

    it('attempts to generate PDF for education debt and logs error', async () => {
      const mockData = {
        education: {
          veteranFullName: 'John Doe',
          ssn: '123456789',
          debtType: 'education',
          debtAmount: 1000,
        },
      };

      const result = await handlePdfGeneration(mockData);

      expect(result).to.be.null;
      expect(sentryScope.setExtra.calledOnce).to.be.true;
      expect(sentryScope.setExtra.firstCall.args[0]).to.equal('error');
      expect(sentryCaptureMessage.calledOnce).to.be.true;
      expect(sentryCaptureMessage.firstCall.args[0]).to.include(
        'generation failed in handlePdfGeneration',
      );
    });

    it('attempts to generate PDF for compAndPen debt and logs error', async () => {
      const mockData = {
        compAndPen: {
          veteranFullName: 'Jane Doe',
          ssn: '987654321',
          debtType: 'compensation',
          debtAmount: 2000,
        },
      };

      const result = await handlePdfGeneration(mockData);

      expect(result).to.be.null;
      expect(sentryScope.setExtra.calledOnce).to.be.true;
      expect(sentryScope.setExtra.firstCall.args[0]).to.equal('error');
      expect(sentryCaptureMessage.calledOnce).to.be.true;
    });

    it('attempts to generate PDFs for both education and compAndPen and logs error', async () => {
      const mockData = {
        education: {
          veteranFullName: 'John Doe',
          ssn: '123456789',
          debtType: 'education',
          debtAmount: 1000,
        },
        compAndPen: {
          veteranFullName: 'John Doe',
          ssn: '123456789',
          debtType: 'compensation',
          debtAmount: 2000,
        },
      };

      const result = await handlePdfGeneration(mockData);

      expect(result).to.be.null;
      expect(sentryScope.setExtra.calledOnce).to.be.true;
      expect(sentryCaptureMessage.calledOnce).to.be.true;
    });

    it('handles error with detail property correctly', async () => {
      const mockData = {
        education: {
          debtType: 'education',
        },
      };

      const result = await handlePdfGeneration(mockData);

      expect(result).to.be.null;
      expect(sentryCaptureMessage.calledOnce).to.be.true;
      // The message should include the error detail handling
      const capturedMessage = sentryCaptureMessage.firstCall.args[0];
      expect(capturedMessage).to.include(
        'generation failed in handlePdfGeneration',
      );
      // Error detail will be undefined in this case
      expect(capturedMessage).to.include('undefined');
    });

    it('handles undefined pdfData parameter', async () => {
      const result = await handlePdfGeneration(undefined);

      expect(result).to.be.null;
      expect(sentryScope.setExtra.calledOnce).to.be.true;
      expect(sentryCaptureMessage.calledOnce).to.be.true;
    });

    it('handles pdfData with falsy education and compAndPen values', async () => {
      const mockData = {
        education: null,
        compAndPen: undefined,
      };

      const result = await handlePdfGeneration(mockData);

      expect(result).to.be.null;
      expect(sentryScope.setExtra.calledOnce).to.be.true;
      expect(sentryCaptureMessage.calledOnce).to.be.true;
    });

    it('handles pdfData with empty education object', async () => {
      const mockData = {
        education: {},
      };

      const result = await handlePdfGeneration(mockData);

      expect(result).to.be.null;
      expect(sentryScope.setExtra.calledOnce).to.be.true;
      expect(sentryCaptureMessage.calledOnce).to.be.true;
    });

    it('handles pdfData with empty compAndPen object', async () => {
      const mockData = {
        compAndPen: {},
      };

      const result = await handlePdfGeneration(mockData);

      expect(result).to.be.null;
      expect(sentryScope.setExtra.calledOnce).to.be.true;
      expect(sentryCaptureMessage.calledOnce).to.be.true;
    });
  });
});
