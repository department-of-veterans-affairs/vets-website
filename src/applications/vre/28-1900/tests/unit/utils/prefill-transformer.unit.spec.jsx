import { expect } from 'chai';
import { getSafeUserFullName } from '../../../utils/prefill-transformer';

describe('getSafeUserFullName', () => {
  it('should return a complete name object when all fields are provided', () => {
    const userFullName = {
      first: 'John',
      middle: 'A',
      last: 'Doe',
      suffix: 'Jr.',
    };

    const result = getSafeUserFullName(userFullName);

    expect(result).to.deep.equal({
      first: 'John',
      middle: 'A',
      last: 'Doe',
      suffix: 'Jr.',
    });
  });

  it('should return empty strings for missing fields', () => {
    const userFullName = {
      first: 'John',
      last: 'Doe',
    };

    const result = getSafeUserFullName(userFullName);

    expect(result).to.deep.equal({
      first: 'John',
      middle: '',
      last: 'Doe',
      suffix: '',
    });
  });

  it('should return all empty strings when userFullName is null', () => {
    const result = getSafeUserFullName(null);

    expect(result).to.deep.equal({
      first: '',
      middle: '',
      last: '',
      suffix: '',
    });
  });

  it('should return all empty strings when userFullName is undefined', () => {
    const result = getSafeUserFullName(undefined);

    expect(result).to.deep.equal({
      first: '',
      middle: '',
      last: '',
      suffix: '',
    });
  });

  it('should return all empty strings when userFullName is an empty object', () => {
    const result = getSafeUserFullName({});

    expect(result).to.deep.equal({
      first: '',
      middle: '',
      last: '',
      suffix: '',
    });
  });
});
