import { expect } from 'chai';
import { edgeCaseBackendError, getFirstError } from '../../util/serverErrors';

describe('serverErrors', () => {
  describe('edgeCaseBackendError', () => {
    it('should return an error object with edge case backend error structure', () => {
      const error = { message: 'Test error', code: 500 };
      const result = edgeCaseBackendError(error);

      expect(result).to.deep.equal({
        title: 'Edge Case Backend Error',
        detail: 'Edge Case Backend Error',
        response: JSON.stringify(error),
      });
    });

    it('should handle null error', () => {
      const result = edgeCaseBackendError(null);

      expect(result).to.deep.equal({
        title: 'Edge Case Backend Error',
        detail: 'Edge Case Backend Error',
        response: JSON.stringify(null),
      });
    });

    it('should handle undefined error', () => {
      const result = edgeCaseBackendError(undefined);

      expect(result).to.deep.equal({
        title: 'Edge Case Backend Error',
        detail: 'Edge Case Backend Error',
        response: JSON.stringify(undefined),
      });
    });

    it('should handle empty object error', () => {
      const result = edgeCaseBackendError({});

      expect(result).to.deep.equal({
        title: 'Edge Case Backend Error',
        detail: 'Edge Case Backend Error',
        response: JSON.stringify({}),
      });
    });

    it('should handle complex error object', () => {
      const error = {
        message: 'Complex error',
        nested: { data: 'value' },
        array: [1, 2, 3],
      };
      const result = edgeCaseBackendError(error);

      expect(result).to.deep.equal({
        title: 'Edge Case Backend Error',
        detail: 'Edge Case Backend Error',
        response: JSON.stringify(error),
      });
    });
  });

  describe('getFirstError', () => {
    it('should return the first error from errors array', () => {
      const error = {
        errors: [
          { title: 'First Error', detail: 'First error detail' },
          { title: 'Second Error', detail: 'Second error detail' },
        ],
      };

      const result = getFirstError(error);

      expect(result).to.deep.equal({
        title: 'First Error',
        detail: 'First error detail',
      });
    });

    it('should return edge case error when errors array is empty', () => {
      const error = {
        errors: [],
      };

      const result = getFirstError(error);

      expect(result).to.deep.equal({
        title: 'Edge Case Backend Error',
        detail: 'Edge Case Backend Error',
        response: JSON.stringify(error),
      });
    });

    it('should return edge case error when errors is not an array', () => {
      const error = {
        errors: 'not an array',
      };

      const result = getFirstError(error);

      expect(result).to.deep.equal({
        title: 'Edge Case Backend Error',
        detail: 'Edge Case Backend Error',
        response: JSON.stringify(error),
      });
    });

    it('should return edge case error when errors is null', () => {
      const error = {
        errors: null,
      };

      const result = getFirstError(error);

      expect(result).to.deep.equal({
        title: 'Edge Case Backend Error',
        detail: 'Edge Case Backend Error',
        response: JSON.stringify(error),
      });
    });

    it('should return edge case error when errors is undefined', () => {
      const error = {
        errors: undefined,
      };

      const result = getFirstError(error);

      expect(result).to.deep.equal({
        title: 'Edge Case Backend Error',
        detail: 'Edge Case Backend Error',
        response: JSON.stringify(error),
      });
    });

    it('should return edge case error when error object has no errors property', () => {
      const error = {
        message: 'Some error',
      };

      const result = getFirstError(error);

      expect(result).to.deep.equal({
        title: 'Edge Case Backend Error',
        detail: 'Edge Case Backend Error',
        response: JSON.stringify(error),
      });
    });

    it('should return edge case error when error is null', () => {
      const result = getFirstError(null);

      expect(result).to.deep.equal({
        title: 'Edge Case Backend Error',
        detail: 'Edge Case Backend Error',
        response: JSON.stringify(null),
      });
    });

    it('should return edge case error when error is undefined', () => {
      const result = getFirstError(undefined);

      expect(result).to.deep.equal({
        title: 'Edge Case Backend Error',
        detail: 'Edge Case Backend Error',
        response: JSON.stringify(undefined),
      });
    });

    it('should handle error with single error in array', () => {
      const error = {
        errors: [{ title: 'Only Error', detail: 'Only error detail' }],
      };

      const result = getFirstError(error);

      expect(result).to.deep.equal({
        title: 'Only Error',
        detail: 'Only error detail',
      });
    });

    it('should handle error with complex error objects', () => {
      const error = {
        errors: [
          {
            title: 'Complex Error',
            detail: 'Complex error detail',
            meta: { info: 'additional' },
            code: 'ERR123',
          },
        ],
      };

      const result = getFirstError(error);

      expect(result).to.deep.equal({
        title: 'Complex Error',
        detail: 'Complex error detail',
        meta: { info: 'additional' },
        code: 'ERR123',
      });
    });
  });
});
