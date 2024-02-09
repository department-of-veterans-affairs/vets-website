import { expect } from 'chai';
import {
  isClientError,
  isServerError,
  parseResponseErrors,
} from '../../../../utils/helpers/disability-rating';

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
    context('default behavior', () => {
      it('should return `null` when no props object is passed', () => {
        expect(parseResponseErrors()).to.be.null;
      });

      it('should return `null` when no error has occurred', () => {
        expect(parseResponseErrors({})).to.be.null;
      });
    });

    context('when there is a single error', () => {
      it('should return a properly formatted response', () => {
        const response = { status: 503, error: 'detail' };
        expect(parseResponseErrors(response).code).to.eq(response.status);
        expect(parseResponseErrors(response).detail).to.eq(response.error);
      });
    });

    context('when there is an array of multiple errors', () => {
      it('should return the first error in the array', () => {
        const errors = [
          { code: 503, detail: 'first error' },
          { code: 404, detail: 'second error' },
        ];
        expect(parseResponseErrors({ errors }).code).to.eq(errors[0].code);
        expect(parseResponseErrors({ errors }).detail).to.eq(errors[0].detail);
      });
    });
  });
});
