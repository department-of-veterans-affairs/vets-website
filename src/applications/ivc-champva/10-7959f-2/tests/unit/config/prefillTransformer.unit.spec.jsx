import { expect } from 'chai';
import prefillTransformer from '../../../config/prefillTransformer';

describe('prefill transformer', () => {
  const profileInfo = {
    personalInformation: {
      fullName: { first: 'John', middle: 'Middle', last: 'Lastname' },
      dateOfBirth: '10222000',
      ssn: '123123123',
    },
    contactInformation: {
      address: {
        country: 'USA',
        street: '123 Street Lane',
        city: 'Citytown',
        state: 'AL',
        postalCode: '12312',
      },
      primaryPhone: '1231231234',
      email: 'email@email.gov',
    },
  };
  it('maps profile data to form fields', () => {
    const transformed = prefillTransformer({}, profileInfo, {});
    expect(transformed.formData.veteranFullName.first).to.equal('John');
    expect(transformed.formData.veteranDateOfBirth).to.equal('10222000');
    expect(transformed.formData.veteranSocialSecurityNumber).to.equal(
      '123123123',
    );
    expect(transformed.formData.veteranAddress.street).to.equal(
      '123 Street Lane',
    );
    expect(transformed.formData.veteranPhoneNumber).to.equal('1231231234');
    expect(transformed.formData.veteranEmailAddress).to.equal(
      'email@email.gov',
    );
  });
});
