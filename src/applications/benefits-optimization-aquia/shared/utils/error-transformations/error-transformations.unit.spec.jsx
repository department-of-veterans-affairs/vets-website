import { expect } from 'chai';

import { ERROR_TRANSFORMATIONS } from './error-transformations';

describe('Error Transformations', () => {
  describe('ERROR_TRANSFORMATIONS', () => {
    it('exports VA component transformations', () => {
      const expectedComponents = [
        'va-text-input',
        'va-checkbox',
        'va-select',
        'va-memorable-date',
        'va-date',
      ];

      expectedComponents.forEach(component => {
        expect(ERROR_TRANSFORMATIONS).to.have.property(component);
      });
    });

    it('provides required methods', () => {
      Object.entries(ERROR_TRANSFORMATIONS).forEach(
        ([_component, transformation]) => {
          expect(transformation)
            .to.have.property('normalizeError')
            .that.is.a('function');
          expect(transformation)
            .to.have.property('getErrorProps')
            .that.is.a('function');
        },
      );
    });
  });

  describe('va-text-input transformation', () => {
    const transformation = ERROR_TRANSFORMATIONS['va-text-input'];

    describe('normalizeError', () => {
      it('clears falsy values', () => {
        expect(transformation.normalizeError(null)).to.be.null;
        expect(transformation.normalizeError(undefined)).to.be.null;
        expect(transformation.normalizeError('')).to.be.null;
        expect(transformation.normalizeError(false)).to.be.null;
        expect(transformation.normalizeError(0)).to.be.null;
      });

      it('trims whitespace', () => {
        expect(transformation.normalizeError('  error  ')).to.equal('error');
        expect(transformation.normalizeError('\nerror\n')).to.equal('error');
        expect(transformation.normalizeError('\t error \t')).to.equal('error');
      });

      it('converts to string', () => {
        expect(transformation.normalizeError(123)).to.equal('123');
        expect(transformation.normalizeError(true)).to.equal('true');
        expect(transformation.normalizeError({ message: 'error' })).to.equal(
          '[object Object]',
        );
      });

      it('uses toString method', () => {
        const errorObj = {
          toString() {
            return 'Custom error';
          },
        };
        expect(transformation.normalizeError(errorObj)).to.equal(
          'Custom error',
        );
      });
    });

    describe('getErrorProps', () => {
      it('sets error and aria-invalid', () => {
        const props = transformation.getErrorProps('Error message');
        expect(props).to.deep.equal({
          error: 'Error message',
          'aria-invalid': 'true',
          noValidate: true,
        });
      });

      it('clears error state', () => {
        const props = transformation.getErrorProps(null);
        expect(props).to.deep.equal({
          error: null,
          'aria-invalid': 'false',
          noValidate: true,
        });
      });

      it('ignores extra parameters', () => {
        const props = transformation.getErrorProps('Error', true, true);
        expect(props).to.deep.equal({
          error: 'Error',
          'aria-invalid': 'true',
          noValidate: true,
        });
      });
    });
  });

  describe('va-checkbox transformation', () => {
    const transformation = ERROR_TRANSFORMATIONS['va-checkbox'];

    describe('normalizeError', () => {
      it('clears falsy values', () => {
        expect(transformation.normalizeError(null)).to.be.null;
        expect(transformation.normalizeError(undefined)).to.be.null;
        expect(transformation.normalizeError('')).to.be.null;
      });

      it('trims whitespace', () => {
        expect(transformation.normalizeError('  checkbox error  ')).to.equal(
          'checkbox error',
        );
      });

      it('converts boolean to string', () => {
        expect(transformation.normalizeError(true)).to.equal('true');
        expect(transformation.normalizeError(false)).to.be.null;
      });
    });

    describe('getErrorProps', () => {
      it('sets error and aria-invalid', () => {
        const props = transformation.getErrorProps('Checkbox error');
        expect(props).to.deep.equal({
          error: 'Checkbox error',
          'aria-invalid': 'true',
        });
      });

      it('handles empty errors', () => {
        const props = transformation.getErrorProps(null);
        expect(props).to.deep.equal({
          error: null,
          'aria-invalid': 'false',
        });
      });
    });
  });

  describe('va-select transformation', () => {
    const transformation = ERROR_TRANSFORMATIONS['va-select'];

    describe('normalizeError', () => {
      it('clears falsy values', () => {
        expect(transformation.normalizeError(null)).to.be.null;
        expect(transformation.normalizeError(undefined)).to.be.null;
        expect(transformation.normalizeError('')).to.be.null;
      });

      it('trims whitespace', () => {
        expect(transformation.normalizeError('  select error  ')).to.equal(
          'select error',
        );
      });

      it('converts arrays to string', () => {
        const result = transformation.normalizeError(['Error 1', 'Error 2']);
        expect(result).to.be.a('string');
      });
    });

    describe('getErrorProps', () => {
      it('sets error and aria-invalid', () => {
        const props = transformation.getErrorProps('Select error');
        expect(props).to.deep.equal({
          error: 'Select error',
          'aria-invalid': 'true',
        });
      });

      it('handles null errors', () => {
        const props = transformation.getErrorProps(null);
        expect(props).to.deep.equal({
          error: null,
          'aria-invalid': 'false',
        });
      });
    });
  });

  describe('va-memorable-date transformation', () => {
    const transformation = ERROR_TRANSFORMATIONS['va-memorable-date'];

    describe('normalizeError', () => {
      it('clears falsy values', () => {
        expect(transformation.normalizeError(null)).to.be.null;
        expect(transformation.normalizeError(undefined)).to.be.null;
        expect(transformation.normalizeError('')).to.be.null;
      });

      it('trims whitespace', () => {
        expect(transformation.normalizeError('  date error  ')).to.equal(
          'date error',
        );
      });

      it('preserves date error messages', () => {
        expect(transformation.normalizeError('Invalid date')).to.equal(
          'Invalid date',
        );
        expect(transformation.normalizeError('Date is required')).to.equal(
          'Date is required',
        );
      });
    });

    describe('getErrorProps', () => {
      it('sets error and aria-invalid', () => {
        const props = transformation.getErrorProps('Date error');
        expect(props).to.deep.equal({
          error: 'Date error',
          'aria-invalid': 'true',
        });
      });

      it('handles null errors', () => {
        const props = transformation.getErrorProps(null);
        expect(props).to.deep.equal({
          error: null,
          'aria-invalid': 'false',
        });
      });

      it('ignores extra parameters', () => {
        const props = transformation.getErrorProps('Error', true, false);
        expect(props).to.deep.equal({
          error: 'Error',
          'aria-invalid': 'true',
        });
      });
    });
  });

  describe('va-date transformation', () => {
    const transformation = ERROR_TRANSFORMATIONS['va-date'];

    describe('normalizeError', () => {
      it('clears falsy values', () => {
        expect(transformation.normalizeError(null)).to.be.null;
        expect(transformation.normalizeError(undefined)).to.be.null;
        expect(transformation.normalizeError('')).to.be.null;
      });

      it('trims whitespace', () => {
        expect(transformation.normalizeError('  date error  ')).to.equal(
          'date error',
        );
      });

      it('preserves complex messages', () => {
        const complexError = 'Date must be between 1900 and 2100';
        expect(transformation.normalizeError(complexError)).to.equal(
          complexError,
        );
      });
    });

    describe('getErrorProps', () => {
      it('sets error and aria-invalid', () => {
        const props = transformation.getErrorProps('Date validation failed');
        expect(props).to.deep.equal({
          error: 'Date validation failed',
          'aria-invalid': 'true',
        });
      });

      it('handles null errors', () => {
        const props = transformation.getErrorProps(null);
        expect(props).to.deep.equal({
          error: null,
          'aria-invalid': 'false',
        });
      });
    });
  });

  describe('Common transformation patterns', () => {
    it('handles null uniformly', () => {
      Object.values(ERROR_TRANSFORMATIONS).forEach(transformation => {
        expect(transformation.normalizeError(null)).to.be.null;
        const props = transformation.getErrorProps(null);
        expect(props).to.have.property('error', null);
        expect(props).to.have.property('aria-invalid', 'false');
      });
    });

    it('handles undefined uniformly', () => {
      Object.values(ERROR_TRANSFORMATIONS).forEach(transformation => {
        expect(transformation.normalizeError(undefined)).to.be.null;
      });
    });

    it('handles empty strings uniformly', () => {
      Object.values(ERROR_TRANSFORMATIONS).forEach(transformation => {
        expect(transformation.normalizeError('')).to.be.null;
      });
    });

    it('trims whitespace uniformly', () => {
      Object.values(ERROR_TRANSFORMATIONS).forEach(transformation => {
        expect(transformation.normalizeError('  error  ')).to.equal('error');
      });
    });

    it('returns consistent props', () => {
      Object.values(ERROR_TRANSFORMATIONS).forEach(transformation => {
        const props = transformation.getErrorProps('Test error');
        expect(props).to.have.property('error');
        expect(props).to.have.property('aria-invalid');
        // Some may have additional props like noValidate
        expect(Object.keys(props).length).to.be.at.least(2);
      });
    });
  });

  describe('Edge cases', () => {
    it('preserves long messages', () => {
      const longError = 'E'.repeat(1000);
      Object.values(ERROR_TRANSFORMATIONS).forEach(transformation => {
        const normalized = transformation.normalizeError(longError);
        expect(normalized).to.have.lengthOf(1000);
      });
    });

    it('preserves special characters', () => {
      const specialError = '<>&"\'`';
      Object.values(ERROR_TRANSFORMATIONS).forEach(transformation => {
        const normalized = transformation.normalizeError(specialError);
        expect(normalized).to.equal(specialError);
      });
    });

    it('preserves Unicode', () => {
      const unicodeError = '错误 ❌ Error';
      Object.values(ERROR_TRANSFORMATIONS).forEach(transformation => {
        const normalized = transformation.normalizeError(unicodeError);
        expect(normalized).to.equal(unicodeError);
      });
    });

    it('preserves multiline messages', () => {
      const multilineError = 'Error\nline 2\nline 3';
      Object.values(ERROR_TRANSFORMATIONS).forEach(transformation => {
        const normalized = transformation.normalizeError(multilineError);
        expect(normalized).to.be.a('string');
        // Should preserve the error content
        expect(normalized).to.include('Error');
      });
    });

    it('converts Error to string', () => {
      const error = new Error('Test error');
      Object.values(ERROR_TRANSFORMATIONS).forEach(transformation => {
        const normalized = transformation.normalizeError(error);
        expect(normalized).to.be.a('string');
      });
    });

    it('handles circular references safely', () => {
      const obj = { error: 'Test' };
      obj.self = obj;

      Object.values(ERROR_TRANSFORMATIONS).forEach(transformation => {
        // Should not throw
        expect(() => {
          transformation.normalizeError(obj);
        }).to.not.throw();
      });
    });
  });

  describe('Performance characteristics', () => {
    it('processes many calls efficiently', () => {
      const transformation = ERROR_TRANSFORMATIONS['va-text-input'];
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        const result = transformation.normalizeError(`Error ${i}`);
        expect(result).to.equal(`Error ${i}`);
      }
    });

    it('preserves input immutability', () => {
      const errorObj = { message: 'Original' };
      const transformation = ERROR_TRANSFORMATIONS['va-text-input'];

      transformation.normalizeError(errorObj);

      expect(errorObj.message).to.equal('Original');
    });
  });
});
