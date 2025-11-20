import { expect } from 'chai';
import sinon from 'sinon';

import { createVAComponentProps } from './component-props';
import { ERROR_TRANSFORMATIONS } from '../error-transformations';
import { logger } from '../logger';

describe('Component Props - VA component utilities', () => {
  let loggerWarnStub;

  beforeEach(() => {
    loggerWarnStub = sinon.stub(logger, 'warn');
  });

  afterEach(() => {
    loggerWarnStub.restore();
  });

  describe('createVAComponentProps', () => {
    it('creates text-input props', () => {
      const props = createVAComponentProps(
        'va-text-input',
        'Error message',
        true,
        false,
      );

      expect(props).to.have.property('error', 'Error message');
    });

    it('create props for va-checkbox component', () => {
      const props = createVAComponentProps(
        'va-checkbox',
        'Checkbox error',
        true,
        false,
      );

      expect(props).to.have.property('error', 'Checkbox error');
    });

    it('create props for va-select component', () => {
      const props = createVAComponentProps(
        'va-select',
        'Select error',
        true,
        false,
      );

      expect(props).to.have.property('error', 'Select error');
    });

    it('not show error when not touched and forceShowErrors is false', () => {
      const props = createVAComponentProps(
        'va-text-input',
        'Error message',
        false,
        false,
      );

      expect(props.error).to.be.null;
    });

    it('show error when forceShowErrors is true regardless of touched state', () => {
      const props = createVAComponentProps(
        'va-text-input',
        'Error message',
        false,
        true,
      );

      expect(props).to.have.property('error', 'Error message');
    });

    it('show error when touched is true', () => {
      const props = createVAComponentProps(
        'va-text-input',
        'Error message',
        true,
        false,
      );

      expect(props).to.have.property('error', 'Error message');
    });

    it('handle null error', () => {
      const props = createVAComponentProps('va-text-input', null, true, false);

      expect(props.error).to.be.null;
    });

    it('handle undefined error', () => {
      const props = createVAComponentProps(
        'va-text-input',
        undefined,
        true,
        false,
      );

      expect(props.error).to.be.null;
    });

    it('handle empty string error', () => {
      const props = createVAComponentProps('va-text-input', '', true, false);

      expect(props.error).to.be.null;
    });

    it('warn for unknown component type', () => {
      const props = createVAComponentProps(
        'unknown-component',
        'Error',
        true,
        false,
      );

      expect(loggerWarnStub.calledOnce).to.be.true;
      expect(
        loggerWarnStub.calledWith(
          'No error transformation found for component: unknown-component',
        ),
      ).to.be.true;
      expect(props).to.deep.equal({ error: 'Error' });
    });

    it('return default error prop for unknown component with no error', () => {
      const props = createVAComponentProps(
        'unknown-component',
        null,
        true,
        false,
      );

      expect(props).to.deep.equal({ error: null });
    });

    it('use component-specific normalization', () => {
      // Test that it calls the transformation's normalizeError
      const props = createVAComponentProps(
        'va-text-input',
        '  Trimmed Error  ',
        true,
        false,
      );

      // The normalizeError should trim the error
      expect(props.error).to.equal('Trimmed Error');
    });

    it('handle all registered component types', () => {
      Object.keys(ERROR_TRANSFORMATIONS).forEach(componentType => {
        const props = createVAComponentProps(
          componentType,
          'Test error',
          true,
          false,
        );

        expect(props).to.have.property('error');
        expect(loggerWarnStub.called).to.be.false;
      });
    });

    it('pass all parameters to getErrorProps', () => {
      const props = createVAComponentProps(
        'va-text-input',
        'Error',
        true,
        true,
      );

      // Should have received normalized error, touched, and forceShowErrors
      expect(props).to.be.an('object');
      expect(props.error).to.equal('Error');
    });

    describe('edge cases', () => {
      it('handle boolean error values', () => {
        const props = createVAComponentProps(
          'va-text-input',
          false,
          true,
          false,
        );
        expect(props.error).to.be.null;
      });

      it('handle number error values', () => {
        const props = createVAComponentProps('va-text-input', 0, true, false);
        expect(props.error).to.be.null;
      });

      it('handle object error values', () => {
        const errorObj = { message: 'Error' };
        const props = createVAComponentProps(
          'va-text-input',
          errorObj,
          true,
          false,
        );
        // normalizeError should convert object to string
        expect(props.error).to.be.a('string');
      });

      it('handle very long error messages', () => {
        const longError = 'E'.repeat(500);
        const props = createVAComponentProps(
          'va-text-input',
          longError,
          true,
          false,
        );
        expect(props.error).to.have.lengthOf(500);
      });

      it('handle special characters in error messages', () => {
        const specialError = '<script>alert("XSS")</script>';
        const props = createVAComponentProps(
          'va-text-input',
          specialError,
          true,
          false,
        );
        expect(props.error).to.equal('<script>alert("XSS")</script>');
      });

      it('handle Unicode characters in error messages', () => {
        const unicodeError = '错误消息 🚫';
        const props = createVAComponentProps(
          'va-text-input',
          unicodeError,
          true,
          false,
        );
        expect(props.error).to.equal('错误消息 🚫');
      });
    });

    describe('interaction with ERROR_TRANSFORMATIONS', () => {
      it('use transformation for va-memorable-date', () => {
        const props = createVAComponentProps(
          'va-memorable-date',
          'Date error',
          true,
          false,
        );
        expect(props).to.have.property('error', 'Date error');
      });

      it('use transformation for va-date', () => {
        const props = createVAComponentProps(
          'va-date',
          'Date error',
          true,
          false,
        );
        expect(props).to.have.property('error', 'Date error');
      });

      it('handle component type case sensitivity', () => {
        // Test with different case
        const props = createVAComponentProps(
          'VA-TEXT-INPUT',
          'Error',
          true,
          false,
        );

        // Should warn because exact case doesn't match
        expect(loggerWarnStub.calledOnce).to.be.true;
        expect(props).to.deep.equal({ error: 'Error' });
      });
    });
  });
});
