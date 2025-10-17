import { expect } from 'chai';

import { ErrorCode, ErrorSeverity, ErrorType } from '../error-constants';
import { FormError } from './form-error';

describe('FormError - Custom error class', () => {
  describe('constructor', () => {
    it('creates error with default values', () => {
      const error = new FormError('Test error');

      expect(error.message).to.equal('Test error');
      expect(error.code).to.equal(ErrorCode.SYSTEM_ERROR);
      expect(error.type).to.equal(ErrorType.SYSTEM);
      expect(error.severity).to.equal(ErrorSeverity.ERROR);
      expect(error.field).to.be.undefined;
      expect(error.context).to.be.undefined;
      expect(error.originalError).to.be.undefined;
      expect(error.timestamp).to.be.a('string');
    });

    it('accepts custom options', () => {
      const options = {
        code: ErrorCode.VALIDATION_ERROR,
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.WARNING,
        field: 'testField',
        context: { extra: 'data' },
        originalError: new Error('Original'),
      };

      const error = new FormError('Validation failed', options);

      expect(error.message).to.equal('Validation failed');
      expect(error.code).to.equal(ErrorCode.VALIDATION_ERROR);
      expect(error.type).to.equal(ErrorType.VALIDATION);
      expect(error.severity).to.equal(ErrorSeverity.WARNING);
      expect(error.field).to.equal('testField');
      expect(error.context).to.deep.equal({ extra: 'data' });
      expect(error.originalError).to.be.instanceOf(Error);
    });

    it('leaves userMessage undefined by default', () => {
      const error = new FormError('Technical error message');

      expect(error.userMessage).to.be.undefined;
    });

    it('supports custom user messages', () => {
      const error = new FormError('Technical error', {
        userMessage: 'Something went wrong. Please try again.',
      });

      expect(error.message).to.equal('Technical error');
      expect(error.userMessage).to.equal(
        'Something went wrong. Please try again.',
      );
    });

    it('generates ISO timestamp', () => {
      const error = new FormError('Error');

      expect(error.timestamp).to.be.a('string');
      expect(error.timestamp).to.match(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it('handles empty message', () => {
      const error = new FormError('');

      expect(error.message).to.equal('');
      expect(error.userMessage).to.be.undefined;
    });

    it('converts null to string', () => {
      const error = new FormError(null);

      expect(error.message).to.equal('null');
      expect(error.userMessage).to.be.undefined;
    });

    it('handles undefined message', () => {
      const error = new FormError(undefined);

      expect(error.message).to.equal('');
      expect(error.userMessage).to.be.undefined;
    });

    it('accepts all error codes', () => {
      Object.values(ErrorCode).forEach(code => {
        const error = new FormError('Test', { code });
        expect(error.code).to.equal(code);
      });
    });

    it('accepts all error types', () => {
      Object.values(ErrorType).forEach(type => {
        const error = new FormError('Test', { type });
        expect(error.type).to.equal(type);
      });
    });

    it('accepts all severity levels', () => {
      Object.values(ErrorSeverity).forEach(severity => {
        const error = new FormError('Test', { severity });
        expect(error.severity).to.equal(severity);
      });
    });
  });

  describe('toJSON', () => {
    it('serializes to JSON object', () => {
      const error = new FormError('Test error', {
        code: ErrorCode.VALIDATION_ERROR,
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.ERROR,
        field: 'testField',
        metadata: { data: 'test' },
      });

      const json = error.toJSON();

      expect(json).to.have.property('message', 'Test error');
      expect(json).to.have.property('code', ErrorCode.VALIDATION_ERROR);
      expect(json).to.have.property('type', ErrorType.VALIDATION);
      expect(json).to.have.property('severity', ErrorSeverity.ERROR);
      expect(json).to.have.property('field', 'testField');
      expect(json)
        .to.have.property('metadata')
        .that.deep.equals({ data: 'test' });
      expect(json).to.have.property('timestamp');
      expect(json).to.have.property('userMessage', undefined);
    });

    it('excludes originalError from JSON', () => {
      const error = new FormError('Test', {
        originalError: new Error('Original'),
      });

      const json = error.toJSON();

      expect(json).to.not.have.property('originalError');
    });

    it('supports JSON.stringify', () => {
      const error = new FormError('Test error', {
        field: 'testField',
        metadata: { nested: { value: 'test' } },
      });

      const jsonString = JSON.stringify(error);
      const parsed = JSON.parse(jsonString);

      expect(parsed.message).to.equal('Test error');
      expect(parsed.field).to.equal('testField');
      expect(parsed.metadata.nested.value).to.equal('test');
    });
  });

  describe('inheritance', () => {
    it('extends Error class', () => {
      const error = new FormError('Test');

      expect(error).to.be.instanceOf(Error);
      expect(error).to.be.instanceOf(FormError);
    });

    it('sets name to FormError', () => {
      const error = new FormError('Test');

      expect(error.name).to.equal('FormError');
    });

    it('includes stack trace', () => {
      const error = new FormError('Test');

      expect(error.stack).to.be.a('string');
      expect(error.stack).to.include('FormError');
    });

    it('catches as Error type', () => {
      let caught = false;

      try {
        throw new FormError('Test error');
      } catch (e) {
        if (e instanceof Error) {
          caught = true;
        }
      }

      expect(caught).to.be.true;
    });

    it('catches as FormError type', () => {
      let caught = false;

      try {
        throw new FormError('Test error');
      } catch (e) {
        if (e instanceof FormError) {
          caught = true;
        }
      }

      expect(caught).to.be.true;
    });
  });

  describe('edge cases', () => {
    it('handles circular references', () => {
      const context = { value: 'test' };
      context.self = context;

      const error = new FormError('Test', { context });

      expect(error.context).to.equal(context);

      expect(() => error.toJSON()).to.not.throw();
    });

    it('preserves all options', () => {
      const allOptions = {
        code: ErrorCode.SERVER_ERROR,
        type: ErrorType.SYSTEM,
        severity: ErrorSeverity.CRITICAL,
        field: 'serverField',
        context: {
          statusCode: 500,
          endpoint: '/api/test',
          timestamp: new Date(),
        },
        originalError: new Error('Server error'),
        userMessage: 'The server is temporarily unavailable',
      };

      const error = new FormError('Internal server error', allOptions);

      expect(error.code).to.equal(allOptions.code);
      expect(error.type).to.equal(allOptions.type);
      expect(error.severity).to.equal(allOptions.severity);
      expect(error.field).to.equal(allOptions.field);
      expect(error.context).to.deep.equal(allOptions.context);
      expect(error.originalError).to.equal(allOptions.originalError);
      expect(error.userMessage).to.equal(allOptions.userMessage);
    });

    it('stores complex metadata', () => {
      const error = new FormError('Validation error', {
        code: ErrorCode.VALIDATION_ERROR,
        field: 'email',
        context: {
          input: 'invalid-email',
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          attempts: 3,
          lastAttempt: new Date(),
        },
      });

      expect(error.context.input).to.equal('invalid-email');
      expect(error.context.pattern).to.be.a('regexp');
      expect(error.context.attempts).to.equal(3);
      expect(error.context.lastAttempt).to.be.a('date');
    });

    it('chains from original errors', () => {
      const originalError = new Error('Original error');
      originalError.code = 'ECONNREFUSED';

      const formError = new FormError('Connection failed', {
        code: ErrorCode.NETWORK_ERROR,
        originalError,
      });

      expect(formError.originalError).to.equal(originalError);
      expect(formError.originalError.message).to.equal('Original error');
      expect(formError.originalError.code).to.equal('ECONNREFUSED');
    });
  });
});
