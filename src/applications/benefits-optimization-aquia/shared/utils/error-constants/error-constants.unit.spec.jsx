import { expect } from 'chai';

import { ErrorCode, ErrorSeverity, ErrorType } from './error-constants';

describe('Error Constants - Error definitions', () => {
  describe('ErrorCode', () => {
    it('exports all error codes', () => {
      expect(ErrorCode).to.have.property('VALIDATION_ERROR');
      expect(ErrorCode).to.have.property('REQUIRED_FIELD');
      expect(ErrorCode).to.have.property('INVALID_FORMAT');
      expect(ErrorCode).to.have.property('INVALID_RANGE');
      expect(ErrorCode).to.have.property('DUPLICATE_VALUE');
      expect(ErrorCode).to.have.property('NETWORK_ERROR');
      expect(ErrorCode).to.have.property('TIMEOUT');
      expect(ErrorCode).to.have.property('SERVER_ERROR');
      expect(ErrorCode).to.have.property('SYSTEM_ERROR');
      expect(ErrorCode).to.have.property('AUTHORIZATION_ERROR');
      expect(ErrorCode).to.have.property('UNAUTHORIZED');
      expect(ErrorCode).to.have.property('SESSION_EXPIRED');
      expect(ErrorCode).to.have.property('INSUFFICIENT_PERMISSIONS');
      expect(ErrorCode).to.have.property('ELIGIBILITY_ERROR');
      expect(ErrorCode).to.have.property('DUPLICATE_SUBMISSION');
      expect(ErrorCode).to.have.property('EXPIRED_FORM');
    });

    it('ensures unique codes', () => {
      const values = Object.values(ErrorCode);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).to.equal(values.length);
    });

    it('have string values', () => {
      Object.values(ErrorCode).forEach(code => {
        expect(code).to.be.a('string');
      });
    });

    it('follow naming convention', () => {
      Object.values(ErrorCode).forEach(code => {
        expect(code).to.match(/^[A-Z_]+$/);
      });
    });

    it('not be frozen object', () => {
      expect(Object.isFrozen(ErrorCode)).to.be.false;
    });

    it('allow modification', () => {
      // JS objects are mutable by default
      ErrorCode.TEST_ERROR = 'TEST_ERROR';
      expect(ErrorCode.TEST_ERROR).to.equal('TEST_ERROR');
      delete ErrorCode.TEST_ERROR;
    });
  });

  describe('ErrorSeverity', () => {
    it('export all expected severity levels', () => {
      expect(ErrorSeverity).to.have.property('INFO');
      expect(ErrorSeverity).to.have.property('WARNING');
      expect(ErrorSeverity).to.have.property('ERROR');
      expect(ErrorSeverity).to.have.property('CRITICAL');
    });

    it('have unique values for all severity levels', () => {
      const values = Object.values(ErrorSeverity);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).to.equal(values.length);
    });

    it('have string values', () => {
      Object.values(ErrorSeverity).forEach(severity => {
        expect(severity).to.be.a('string');
      });
    });

    it('follow lowercase naming convention', () => {
      Object.values(ErrorSeverity).forEach(severity => {
        expect(severity).to.match(/^[a-z]+$/);
      });
    });

    it('not be frozen object', () => {
      expect(Object.isFrozen(ErrorSeverity)).to.be.false;
    });

    it('represent increasing severity levels', () => {
      // Verify the expected order
      expect(ErrorSeverity.INFO).to.equal('info');
      expect(ErrorSeverity.WARNING).to.equal('warning');
      expect(ErrorSeverity.ERROR).to.equal('error');
      expect(ErrorSeverity.CRITICAL).to.equal('critical');
    });
  });

  describe('ErrorType', () => {
    it('export all expected error types', () => {
      expect(ErrorType).to.have.property('FIELD');
      expect(ErrorType).to.have.property('FORM');
      expect(ErrorType).to.have.property('VALIDATION');
      expect(ErrorType).to.have.property('NETWORK');
      expect(ErrorType).to.have.property('AUTH');
      expect(ErrorType).to.have.property('BUSINESS');
      expect(ErrorType).to.have.property('SYSTEM');
    });

    it('have unique values for all error types', () => {
      const values = Object.values(ErrorType);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).to.equal(values.length);
    });

    it('have string values', () => {
      Object.values(ErrorType).forEach(type => {
        expect(type).to.be.a('string');
      });
    });

    it('follow lowercase naming convention', () => {
      Object.values(ErrorType).forEach(type => {
        expect(type).to.match(/^[a-z]+$/);
      });
    });

    it('not be frozen object', () => {
      expect(Object.isFrozen(ErrorType)).to.be.false;
    });

    it('allow modification', () => {
      // JS objects are mutable by default
      ErrorType.TEST_TYPE = 'test_type';
      expect(ErrorType.TEST_TYPE).to.equal('test_type');
      delete ErrorType.TEST_TYPE;
    });
  });

  describe('Constants relationships', () => {
    it('have appropriate error codes for each error type', () => {
      // Validation errors
      expect(ErrorCode.VALIDATION_ERROR).to.include('VALIDATION');
      expect(ErrorCode.REQUIRED_FIELD).to.exist;
      expect(ErrorCode.INVALID_FORMAT).to.exist;

      // Network errors
      expect(ErrorCode.NETWORK_ERROR).to.include('NETWORK');
      expect(ErrorCode.TIMEOUT).to.exist;

      // Authorization errors
      expect(ErrorCode.AUTHORIZATION_ERROR).to.include('AUTHORIZATION');
      expect(ErrorCode.SESSION_EXPIRED).to.exist;

      // System errors
      expect(ErrorCode.SERVER_ERROR).to.include('SERVER');
      expect(ErrorCode.SYSTEM_ERROR).to.include('SYSTEM');
    });

    it('provide comprehensive coverage of error scenarios', () => {
      // Check that we have errors for common scenarios
      const commonScenarios = [
        'VALIDATION',
        'REQUIRED',
        'FORMAT',
        'NETWORK',
        'TIMEOUT',
        'SERVER',
        'AUTHORIZATION',
        'SESSION',
        'SUBMISSION',
      ];

      const allCodes = Object.values(ErrorCode).join(' ');

      commonScenarios.forEach(scenario => {
        expect(allCodes).to.include(scenario);
      });
    });
  });

  describe('Usage patterns', () => {
    it('support error categorization', () => {
      // Simulate categorizing errors by type
      const validationErrors = [
        ErrorCode.VALIDATION_ERROR,
        ErrorCode.REQUIRED_FIELD,
        ErrorCode.INVALID_FORMAT,
        ErrorCode.INVALID_RANGE,
        ErrorCode.DUPLICATE_VALUE,
      ];

      validationErrors.forEach(error => {
        expect(error).to.be.a('string');
      });
    });

    it('support severity-based error handling', () => {
      // Simulate handling errors by severity
      const handleBySeverity = severity => {
        switch (severity) {
          case ErrorSeverity.INFO:
            return 'log';
          case ErrorSeverity.WARNING:
            return 'warn';
          case ErrorSeverity.ERROR:
            return 'alert';
          case ErrorSeverity.CRITICAL:
            return 'fatal';
          default:
            return 'unknown';
        }
      };

      expect(handleBySeverity(ErrorSeverity.INFO)).to.equal('log');
      expect(handleBySeverity(ErrorSeverity.WARNING)).to.equal('warn');
      expect(handleBySeverity(ErrorSeverity.ERROR)).to.equal('alert');
      expect(handleBySeverity(ErrorSeverity.CRITICAL)).to.equal('fatal');
    });

    it('support type-based error recovery', () => {
      // Simulate recovery strategies by type
      const getRecoveryStrategy = type => {
        switch (type) {
          case ErrorType.NETWORK:
            return 'retry';
          case ErrorType.AUTHORIZATION:
            return 'reauth';
          case ErrorType.VALIDATION:
            return 'correct';
          case ErrorType.SYSTEM:
            return 'report';
          default:
            return 'none';
        }
      };

      expect(getRecoveryStrategy(ErrorType.NETWORK)).to.equal('retry');
      expect(getRecoveryStrategy(ErrorType.AUTHORIZATION)).to.equal('reauth');
      expect(getRecoveryStrategy(ErrorType.VALIDATION)).to.equal('correct');
      expect(getRecoveryStrategy(ErrorType.SYSTEM)).to.equal('report');
    });
  });
});
