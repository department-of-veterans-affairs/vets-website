import { expect } from 'chai';
import { getAuthError, AUTH_ERRORS } from '../../authentication/errors'; // Adjust the import path as necessary.

describe('getAuthError', () => {
  it('should return the correct error object for a valid error code', () => {
    const errorCode = '001';
    const expectedError = {
      errorCode: '001',
      message: "User clicked 'Deny' in Authorization",
    };
    const result = getAuthError(errorCode);
    expect(result).to.deep.equal(expectedError);
  });

  it('should return the DEFAULT error object for an unknown error code', () => {
    const errorCode = '999';
    const expectedError = AUTH_ERRORS.DEFAULT;
    const result = getAuthError(errorCode);
    expect(result).to.deep.equal(expectedError);
  });

  it('should handle null input and return the DEFAULT error object', () => {
    const result = getAuthError(null);
    const expectedError = AUTH_ERRORS.DEFAULT;
    expect(result).to.deep.equal(expectedError);
  });

  it('should handle undefined input and return the DEFAULT error object', () => {
    const result = getAuthError(undefined);
    const expectedError = AUTH_ERRORS.DEFAULT;
    expect(result).to.deep.equal(expectedError);
  });

  it('should handle numeric input and return the DEFAULT error object', () => {
    const result = getAuthError(123);
    const expectedError = AUTH_ERRORS.DEFAULT;
    expect(result).to.deep.equal(expectedError);
  });

  it('should return the correct error object for a case-sensitive match', () => {
    const errorCode = '009';
    const expectedError = {
      errorCode: '009',
      message: 'Login.gov Failure to Proof',
    };
    const result = getAuthError(errorCode);
    expect(result).to.deep.equal(expectedError);
  });

  it('should handle an empty string input and return the DEFAULT error object', () => {
    const result = getAuthError('');
    const expectedError = AUTH_ERRORS.DEFAULT;
    expect(result).to.deep.equal(expectedError);
  });

  it('should not throw and should return the DEFAULT error object for unexpected input types', () => {
    const result = getAuthError({ errorCode: '001' }); // Invalid type
    const expectedError = AUTH_ERRORS.DEFAULT;
    expect(result).to.deep.equal(expectedError);
  });
});
