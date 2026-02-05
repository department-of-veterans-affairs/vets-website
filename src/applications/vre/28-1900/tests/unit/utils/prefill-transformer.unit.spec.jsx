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

  it('should not include middle name or suffix when they are missing', () => {
    const userFullName = {
      first: 'John',
      last: 'Doe',
    };

    const result = getSafeUserFullName(userFullName);

    expect(result).to.deep.equal({
      first: 'John',
      last: 'Doe',
    });
    expect(result).to.not.have.property('middle');
    expect(result).to.not.have.property('suffix');
  });

  it('should return only first and last as empty strings when input is null, undefined, or empty', () => {
    [null, undefined, {}].forEach(input => {
      const result = getSafeUserFullName(input);

      expect(result).to.deep.equal({
        first: '',
        last: '',
      });
      expect(result).to.not.have.property('middle');
      expect(result).to.not.have.property('suffix');
    });
  });

  it('should not include middle name key when middle name is falsy', () => {
    [null, undefined, ''].forEach(middleValue => {
      const userFullName = {
        first: 'John',
        middle: middleValue,
        last: 'Doe',
      };

      const result = getSafeUserFullName(userFullName);

      expect(result).to.deep.equal({
        first: 'John',
        last: 'Doe',
      });
      expect(result).to.not.have.property('middle');
    });
  });

  it('should not include suffix key when suffix is falsy', () => {
    [null, undefined, ''].forEach(suffixValue => {
      const userFullName = {
        first: 'John',
        middle: 'A',
        last: 'Doe',
        suffix: suffixValue,
      };

      const result = getSafeUserFullName(userFullName);

      expect(result).to.deep.equal({
        first: 'John',
        middle: 'A',
        last: 'Doe',
      });
      expect(result).to.not.have.property('suffix');
    });
  });
});

describe('prefillTransformer', () => {
  const mockState = {
    user: {
      profile: {
        dob: '1980-01-01',
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
    const formData = {
      'view:vrePrefillName': true,
      veteranInformation: {
        fullName: { first: 'John', middle: null, last: 'Doe' },
      },
    };
    const metadata = {};

    const result = prefillModule.prefillTransformer(
      pages,
      formData,
      metadata,
      mockState,
    );

    expect(result.formData.fullName).to.deep.equal({
      first: 'John',
      last: 'Doe',
    });
    expect(result.formData.fullName).to.not.have.property('middle');
  });

  it('should use fullName directly when view:vrePrefillName is falsy', () => {
    const pages = [];
    const backendFullName = { first: 'Jane', middle: null, last: 'Smith' };
    const formData = {
      veteranInformation: {
        fullName: backendFullName,
      },
    };
    const metadata = {};

    const result = prefillModule.prefillTransformer(
      pages,
      formData,
      metadata,
      mockState,
    );

    expect(result.formData.fullName).to.equal(backendFullName);
    expect(result.formData.fullName.middle).to.be.null;
  });

  it('should map all prefill data correctly', () => {
    const pages = [];
    const formData = {
      'view:vrePrefillName': true,
      veteranInformation: {
        fullName: { first: 'John', middle: 'A', last: 'Doe' },
      },
    };
    const metadata = {};

    const result = prefillModule.prefillTransformer(
      pages,
      formData,
      metadata,
      mockState,
    );

    expect(result.formData.dob).to.equal('1980-01-01');
    expect(result.formData.veteranAddress).to.deep.equal({
      country: 'USA',
      street: '123 Main St',
      street2: 'Apt 4',
      street3: '',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
    });
  });
});
