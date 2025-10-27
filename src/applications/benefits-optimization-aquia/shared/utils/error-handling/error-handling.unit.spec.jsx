import { expect } from 'chai';
import sinon from 'sinon';

import {
  ErrorCode,
  ErrorCollection,
  ErrorSeverity,
  ErrorType,
  FormError,
  createErrorBoundary,
  formatErrorForDisplay,
  isRecoverableError,
  logError,
} from './error-handling';
import { logger } from '../logger';

describe('Error Handling', () => {
  describe('ErrorCollection', () => {
    let collection;

    beforeEach(() => {
      collection = new ErrorCollection();
    });

    it('starts empty', () => {
      expect(collection.errors.size).to.equal(0);
      expect(collection.globalErrors).to.have.lengthOf(0);
      expect(collection.hasErrors()).to.be.false;
    });

    describe('addFieldError', () => {
      it('adds string errors to fields', () => {
        collection.addFieldError('email', 'Invalid email');
        expect(collection.hasErrors()).to.be.true;
        expect(collection.getFieldErrors('email')).to.have.lengthOf(1);
        expect(collection.getFieldErrors('email')[0].message).to.equal(
          'Invalid email',
        );
      });

      it('adds FormError instances to fields', () => {
        const error = new FormError('Invalid format', {
          field: 'email',
          code: ErrorCode.VALIDATION_ERROR,
        });
        collection.addFieldError('email', error);
        expect(collection.getFieldErrors('email')[0]).to.equal(error);
      });

      it('accumulates multiple field errors', () => {
        collection.addFieldError('email', 'Error 1');
        collection.addFieldError('email', 'Error 2');
        expect(collection.getFieldErrors('email')).to.have.lengthOf(2);
      });
    });

    describe('addGlobalError', () => {
      it('adds string to global errors', () => {
        collection.addGlobalError('Form submission failed');
        expect(collection.hasErrors()).to.be.true;
        expect(collection.globalErrors).to.have.lengthOf(1);
      });

      it('adds FormError to global errors', () => {
        const error = new FormError('Network error', {
          code: ErrorCode.NETWORK_ERROR,
        });
        collection.addGlobalError(error);
        expect(collection.globalErrors[0]).to.equal(error);
      });
    });

    describe('clearFieldErrors', () => {
      it('clears specific field errors', () => {
        collection.addFieldError('email', 'Error 1');
        collection.addFieldError('name', 'Error 2');
        collection.clearFieldErrors('email');

        expect(collection.getFieldErrors('email')).to.have.lengthOf(0);
        expect(collection.getFieldErrors('name')).to.have.lengthOf(1);
      });
    });

    describe('clearAllErrors', () => {
      it('clears all errors', () => {
        collection.addFieldError('email', 'Error 1');
        collection.addGlobalError('Global error');
        collection.clearAllErrors();

        expect(collection.hasErrors()).to.be.false;
        expect(collection.errors.size).to.equal(0);
        expect(collection.globalErrors).to.have.lengthOf(0);
      });
    });

    describe('getFieldErrors', () => {
      it('returns empty array for missing fields', () => {
        expect(collection.getFieldErrors('missing')).to.have.lengthOf(0);
      });

      it('returns field errors', () => {
        collection.addFieldError('email', 'Error');
        expect(collection.getFieldErrors('email')).to.have.lengthOf(1);
      });
    });

    describe('getAllErrors', () => {
      it('returns combined error list', () => {
        collection.addFieldError('email', 'Email error');
        collection.addFieldError('name', 'Name error');
        collection.addGlobalError('Global error');

        const allErrors = collection.getAllErrors();
        expect(allErrors).to.have.lengthOf(3);
      });
    });

    describe('getErrorSummary', () => {
      it('returns error summary object', () => {
        collection.addFieldError('email', 'Email error');
        collection.addGlobalError('Global error');

        const summary = collection.getErrorSummary();
        expect(summary.fieldErrors).to.have.property('email');
        expect(summary.globalErrors).to.have.lengthOf(1);
      });
    });

    describe('getFirstError', () => {
      it('returns first field error', () => {
        collection.addFieldError('email', 'First');
        collection.addFieldError('name', 'Second');

        const first = collection.getFirstError();
        expect(first.message).to.equal('First');
      });

      it('returns global error when no field errors', () => {
        collection.addGlobalError('Global');

        const first = collection.getFirstError();
        expect(first.message).to.equal('Global');
      });

      it('returns null when empty', () => {
        expect(collection.getFirstError()).to.be.null;
      });
    });

    describe('mergeCollection', () => {
      it('merges error collections', () => {
        const other = new ErrorCollection();
        other.addFieldError('email', 'Other email error');
        other.addGlobalError('Other global');

        collection.addFieldError('name', 'Name error');
        collection.mergeCollection(other);

        expect(collection.getFieldErrors('email')).to.have.lengthOf(1);
        expect(collection.getFieldErrors('name')).to.have.lengthOf(1);
        expect(collection.globalErrors).to.have.lengthOf(1);
      });
    });
  });

  describe('formatErrorForDisplay', () => {
    it('formats FormError with user message', () => {
      const error = new FormError('Test error', {
        field: 'email',
        userMessage: 'Please check your email',
      });

      const formatted = formatErrorForDisplay(error);
      expect(formatted).to.equal('Please check your email');
    });

    it('formats Error message', () => {
      const error = new Error('Regular error');
      const formatted = formatErrorForDisplay(error);
      expect(formatted).to.equal('Regular error');
    });

    it('returns string as-is', () => {
      const formatted = formatErrorForDisplay('String error');
      expect(formatted).to.equal('String error');
    });

    it('provides default for null/undefined', () => {
      expect(formatErrorForDisplay(null)).to.equal('An error occurred');
      expect(formatErrorForDisplay(undefined)).to.equal('An error occurred');
    });

    it('includes field with custom prefix', () => {
      const error = new FormError('Test', { field: 'email' });
      const formatted = formatErrorForDisplay(error, {
        includeField: true,
        fieldPrefix: 'Field: ',
      });
      expect(formatted).to.include('Field: email');
    });
  });

  describe('isRecoverableError', () => {
    it('identifies recoverable errors', () => {
      const validationError = new FormError('Invalid', {
        code: ErrorCode.VALIDATION_ERROR,
        severity: ErrorSeverity.WARNING,
      });
      expect(isRecoverableError(validationError)).to.be.true;

      const networkError = new FormError('Network', {
        code: ErrorCode.NETWORK_ERROR,
        severity: ErrorSeverity.ERROR,
      });
      expect(isRecoverableError(networkError)).to.be.true;
    });

    it('identifies critical errors', () => {
      const criticalError = new FormError('Critical', {
        severity: ErrorSeverity.CRITICAL,
      });
      expect(isRecoverableError(criticalError)).to.be.false;

      const authError = new FormError('Auth', {
        code: ErrorCode.AUTHORIZATION_ERROR,
      });
      expect(isRecoverableError(authError)).to.be.false;
    });

    it('treats regular errors as recoverable', () => {
      const regularError = new Error('Regular');
      expect(isRecoverableError(regularError)).to.be.true;
    });
  });

  describe('logError', () => {
    let loggerErrorStub;
    let loggerWarnStub;
    let loggerInfoStub;

    beforeEach(() => {
      loggerErrorStub = sinon.stub(logger, 'error');
      loggerWarnStub = sinon.stub(logger, 'warn');
      loggerInfoStub = sinon.stub(logger, 'info');
    });

    afterEach(() => {
      loggerErrorStub.restore();
      loggerWarnStub.restore();
      loggerInfoStub.restore();
    });

    it('logs at appropriate severity level', () => {
      const criticalError = new FormError('Critical', {
        severity: ErrorSeverity.CRITICAL,
      });
      logError(criticalError);
      expect(loggerErrorStub.called).to.be.true;

      const warningError = new FormError('Warning', {
        severity: ErrorSeverity.WARNING,
      });
      logError(warningError);
      expect(loggerWarnStub.called).to.be.true;

      const infoError = new FormError('Info', {
        severity: ErrorSeverity.INFO,
      });
      logError(infoError);
      expect(loggerInfoStub.called).to.be.true;
    });

    it('includes error context', () => {
      const error = new FormError('Test', {
        context: { userId: 123 },
      });
      logError(error);
      expect(loggerErrorStub.called).to.be.true;
      expect(loggerErrorStub.firstCall.args[1]).to.deep.equal({
        context: { userId: 123 },
      });
    });
  });

  describe('createErrorBoundary', () => {
    it('creates boundary configuration', () => {
      const onError = sinon.spy();
      const boundary = createErrorBoundary({
        onError,
        fallback: 'Error occurred',
      });

      expect(boundary).to.have.property('onError');
      expect(boundary).to.have.property('fallback');
      expect(boundary).to.have.property('resetKeys');
    });

    it('calls error callback', () => {
      const onError = sinon.spy();
      const boundary = createErrorBoundary({ onError });

      const error = new Error('Test');
      boundary.onError(error, {});

      expect(onError.calledWith(error)).to.be.true;
    });
  });

  describe('Error Constants', () => {
    it('exports error codes', () => {
      expect(ErrorCode.VALIDATION_ERROR).to.equal('VALIDATION_ERROR');
      expect(ErrorCode.NETWORK_ERROR).to.equal('NETWORK_ERROR');
      expect(ErrorCode.AUTHORIZATION_ERROR).to.equal('AUTHORIZATION_ERROR');
    });

    it('exports severity levels', () => {
      expect(ErrorSeverity.INFO).to.equal('info');
      expect(ErrorSeverity.WARNING).to.equal('warning');
      expect(ErrorSeverity.ERROR).to.equal('error');
      expect(ErrorSeverity.CRITICAL).to.equal('critical');
    });

    it('exports error types', () => {
      expect(ErrorType.FIELD).to.equal('field');
      expect(ErrorType.FORM).to.equal('form');
      expect(ErrorType.NETWORK).to.equal('network');
      expect(ErrorType.SYSTEM).to.equal('system');
    });
  });
});
