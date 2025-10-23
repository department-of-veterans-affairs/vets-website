import { expect } from 'chai';
import { parseResponseErrors } from '../../../../utils/helpers';

describe('hca `parseResponseErrors` helper', () => {
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
