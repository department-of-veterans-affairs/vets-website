import { expect } from 'chai';
import sinon from 'sinon';

import { debugValidation } from './debug-utils';
import { logger } from '../logger';

describe('Debug Utils', () => {
  let loggerDebugStub;

  beforeEach(() => {
    loggerDebugStub = sinon.stub(logger, 'debug');
  });

  afterEach(() => {
    loggerDebugStub.restore();
  });

  describe('debugValidation', () => {
    it('stays silent when disabled', () => {
      const validation = {
        error: 'Test error',
        touched: true,
        valid: false,
      };

      debugValidation('testField', validation, false);

      expect(loggerDebugStub.called).to.be.false;
    });

    it('skips logging when undefined', () => {
      const validation = {
        error: 'Test error',
        touched: true,
        valid: false,
      };

      debugValidation('testField', validation);

      expect(loggerDebugStub.called).to.be.false;
    });

    it('logs validation state', () => {
      const validation = {
        error: 'Test error',
        touched: true,
        valid: false,
      };

      debugValidation('testField', validation, true);

      expect(loggerDebugStub.calledOnce).to.be.true;
      expect(loggerDebugStub.firstCall.args[0]).to.equal(
        'Validation Debug: testField',
      );
      expect(loggerDebugStub.firstCall.args[1]).to.deep.equal({
        state: validation,
        error: 'Test error',
        touched: true,
        valid: false,
      });
    });

    it('logs complete validation objects', () => {
      const validation = {
        error: 'Required field',
        touched: true,
        valid: false,
        pristine: false,
        validating: false,
      };

      debugValidation('fullField', validation, true);

      expect(loggerDebugStub.calledOnce).to.be.true;
      const loggedData = loggerDebugStub.firstCall.args[1];
      expect(loggedData.state).to.deep.equal(validation);
      expect(loggedData.error).to.equal('Required field');
      expect(loggedData.touched).to.be.true;
      expect(loggedData.valid).to.be.false;
    });

    it('logs null errors', () => {
      const validation = {
        error: null,
        touched: false,
        valid: true,
      };

      debugValidation('validField', validation, true);

      expect(loggerDebugStub.calledOnce).to.be.true;
      const loggedData = loggerDebugStub.firstCall.args[1];
      expect(loggedData.error).to.be.null;
      expect(loggedData.valid).to.be.true;
    });

    it('logs undefined errors', () => {
      const validation = {
        error: undefined,
        touched: false,
        valid: true,
      };

      debugValidation('noErrorField', validation, true);

      expect(loggerDebugStub.calledOnce).to.be.true;
      const loggedData = loggerDebugStub.firstCall.args[1];
      expect(loggedData.error).to.be.undefined;
    });

    it('logs empty field names', () => {
      const validation = {
        error: 'Error',
        touched: true,
        valid: false,
      };

      debugValidation('', validation, true);

      expect(loggerDebugStub.calledOnce).to.be.true;
      expect(loggerDebugStub.firstCall.args[0]).to.equal('Validation Debug: ');
    });

    it('logs complex field paths', () => {
      const validation = {
        error: 'Error',
        touched: true,
        valid: false,
      };

      debugValidation('field[0].nested.value', validation, true);

      expect(loggerDebugStub.calledOnce).to.be.true;
      expect(loggerDebugStub.firstCall.args[0]).to.equal(
        'Validation Debug: field[0].nested.value',
      );
    });

    it('includes custom properties', () => {
      const validation = {
        error: 'Error',
        touched: true,
        valid: false,
        customProp: 'custom',
        anotherProp: 123,
      };

      debugValidation('extraPropsField', validation, true);

      expect(loggerDebugStub.calledOnce).to.be.true;
      const loggedData = loggerDebugStub.firstCall.args[1];
      expect(loggedData.state).to.include({
        customProp: 'custom',
        anotherProp: 123,
      });
    });

    it('logs touched state', () => {
      const validationTrue = {
        error: 'Error',
        touched: true,
        valid: false,
      };

      debugValidation('touchedTrue', validationTrue, true);

      expect(loggerDebugStub.firstCall.args[1].touched).to.be.true;

      const validationFalse = {
        error: null,
        touched: false,
        valid: true,
      };

      debugValidation('touchedFalse', validationFalse, true);

      expect(loggerDebugStub.secondCall.args[1].touched).to.be.false;
    });

    it('logs error objects', () => {
      const validation = {
        error: { message: 'Complex error', code: 'ERR_001' },
        touched: true,
        valid: false,
      };

      debugValidation('complexError', validation, true);

      expect(loggerDebugStub.calledOnce).to.be.true;
      const loggedData = loggerDebugStub.firstCall.args[1];
      expect(loggedData.error).to.deep.equal({
        message: 'Complex error',
        code: 'ERR_001',
      });
    });

    it('logs error arrays', () => {
      const validation = {
        error: ['Error 1', 'Error 2'],
        touched: true,
        valid: false,
      };

      debugValidation('arrayErrors', validation, true);

      expect(loggerDebugStub.calledOnce).to.be.true;
      const loggedData = loggerDebugStub.firstCall.args[1];
      expect(loggedData.error).to.deep.equal(['Error 1', 'Error 2']);
    });

    it('preserves original object', () => {
      const validation = {
        error: 'Test error',
        touched: true,
        valid: false,
      };

      const originalValidation = { ...validation };

      debugValidation('immutableTest', validation, true);

      expect(validation).to.deep.equal(originalValidation);
    });

    it('throws for null validation', () => {
      expect(() => {
        debugValidation('nullValidation', null, true);
      }).to.throw();
    });

    it('throws for undefined validation', () => {
      expect(() => {
        debugValidation('undefinedValidation', undefined, true);
      }).to.throw();
    });

    it('logs empty objects', () => {
      const validation = {};

      debugValidation('emptyValidation', validation, true);

      expect(loggerDebugStub.calledOnce).to.be.true;
      const loggedData = loggerDebugStub.firstCall.args[1];
      expect(loggedData.state).to.deep.equal({});
      expect(loggedData.error).to.be.undefined;
      expect(loggedData.touched).to.be.undefined;
      expect(loggedData.valid).to.be.undefined;
    });
  });
});
