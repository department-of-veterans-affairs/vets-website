import { expect } from 'chai';
import * as prefillModule from '../../../utils/prefill-transformer';

const { getSafeUserFullName } = prefillModule;

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

  it('should return empty strings for missing fields and not include suffix', () => {
    const userFullName = {
      first: 'John',
      last: 'Doe',
    };

    const result = getSafeUserFullName(userFullName);

    expect(result).to.deep.equal({
      first: 'John',
      middle: '',
      last: 'Doe',
    });
  });

  it('should return all empty strings when userFullName is null', () => {
    const result = getSafeUserFullName(null);

    expect(result).to.deep.equal({
      first: '',
      middle: '',
      last: '',
    });
  });

  it('should return all empty strings when userFullName is undefined', () => {
    const result = getSafeUserFullName(undefined);

    expect(result).to.deep.equal({
      first: '',
      middle: '',
      last: '',
    });
  });

  it('should return all empty strings when userFullName is an empty object', () => {
    const result = getSafeUserFullName({});

    expect(result).to.deep.equal({
      first: '',
      middle: '',
      last: '',
    });
  });
});

describe('prefillTransformer', () => {
  const mockState = {
    user: {
      profile: {
        dob: '1980-01-01',
        userFullName: {
          first: 'John',
          middle: 'A',
          last: 'Doe',
          suffix: 'Jr.',
        },
        vapContactInfo: {
          mailingAddress: {
            countryCodeIso3: 'USA',
            addressLine1: '123 Main St',
            addressLine2: 'Apt 4',
            addressLine3: '',
            city: 'Springfield',
            stateCode: 'IL',
            zipCode: '62701',
          },
        },
      },
    },
  };

  it('should use getSafeUserFullName when view:vrePrefillName is true', () => {
    const pages = [];
    const formData = { 'view:vrePrefillName': true };
    const metadata = {};

    prefillModule.prefillTransformer(pages, formData, metadata, mockState);
  });

  it('should not use getSafeUserFullName when view:vrePrefillName is false', () => {
    const pages = [];
    const existingFullName = { first: 'Jane', middle: 'B', last: 'Smith' };
    const formData = {
      'view:vrePrefillName': false,
      fullName: existingFullName,
    };
    const metadata = {};

    prefillModule.prefillTransformer(pages, formData, metadata, mockState);
  });

  it('should not use getSafeUserFullName when view:vrePrefillName is undefined', () => {
    const pages = [];
    const existingFullName = { first: 'Jane', middle: 'B', last: 'Smith' };
    const formData = { fullName: existingFullName };
    const metadata = {};

    prefillModule.prefillTransformer(pages, formData, metadata, mockState);
  });
});
