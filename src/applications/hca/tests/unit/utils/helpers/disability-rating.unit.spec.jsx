import { expect } from 'chai';
import {
  isClientError,
  isServerError,
  parseResponseErrors,
} from '../../../../utils/helpers';

describe('hca disability rating helpers', () => {
  context('when `isClientError` executes', () => {
    it('should return `true` with error code between 400 & 499', () => {
      expect(isClientError(404)).to.be.true;
    });

    it('should return `false` with error code not between 400 & 499', () => {
      expect(isClientError(503)).to.be.false;
    });

    it('should return `false` with with non-numeric value', () => {
      expect(isClientError('ddd')).to.be.false;
    });

    it('should return `false` with with no props', () => {
      expect(isClientError()).to.be.false;
    });
  });

  context('when `isServerError` executes', () => {
    it('should return `true` with error code between 500 & 599', () => {
      expect(isServerError(503)).to.be.true;
    });

    it('should return `false` with error code not between 500 & 599', () => {
      expect(isServerError(404)).to.be.false;
    });

    it('should return `false` with with non-numeric value', () => {
      expect(isServerError('ddd')).to.be.false;
    });

    it('should return `false` with with no props', () => {
      expect(isServerError()).to.be.false;
    });
  });

  context('when `parseResponseErrors` executes', () => {
    it('should return an object with `null` values when no props object is passed', () => {
      const response = JSON.stringify({ code: null, detail: null });
      expect(JSON.stringify(parseResponseErrors())).to.eq(response);
    });

    it('should return an object with `null` values when no error has occurred', () => {
      const response = JSON.stringify({ code: null, detail: null });
      expect(JSON.stringify(parseResponseErrors({}))).to.eq(response);
    });

    it('should return a properly-formatted response when there is a single error', () => {
      const response = { status: 503, error: 'detail' };
      expect(parseResponseErrors(response).code).to.eq(response.status);
      expect(parseResponseErrors(response).detail).to.eq(response.error);
    });

    it('should return the first error when there is an array of errors', () => {
      const errors = [
        { code: 503, detail: 'first error' },
        { code: 404, detail: 'second error' },
      ];
      expect(parseResponseErrors({ errors }).code).to.eq(errors[0].code);
      expect(parseResponseErrors({ errors }).detail).to.eq(errors[0].detail);
    });
  });
});
