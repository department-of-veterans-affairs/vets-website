// test/config/prefillTransformer.unit.spec.js
import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

describe('prefillTransformer', () => {
  const pages = { a: 1 };
  const metadata = { version: 1 };

  it('should transform contact information and prefer formData.email over profile email', () => {
    const formData = {
      applicantFullName: { first: 'Jane', last: 'Doe' },
      email: 'jane.data@example.com',
      ssn: '123456789',
      mailingAddress: { street: '1 Main', city: 'Town', state: 'VA' },
      contactInfo: { homePhone: '5551112222', mobilePhone: '5553334444' },
      dateOfBirth: '1990-01-01',
    };

    const state = {
      user: {
        profile: {
          dob: '1989-12-31',
          email: 'jane.profile@example.com',
          userFullName: { first: 'Profile', last: 'Name' },
          vapContactInfo: {
            homePhone: {
              areaCode: '555',
              countryCode: '1',
              phoneNumber: '1112222',
            },
            mobilePhone: {
              areaCode: '555',
              countryCode: '1',
              phoneNumber: '3334444',
            },
          },
        },
      },
      data: {},
    };

    const result = prefillTransformer(pages, formData, metadata, state);
    const data = result.formData;

    expect(data.contactInfo).to.deep.equal({
      homePhone: {
        callingCode: 1,
        countryCode: 'US',
        contact: '5551112222',
      },
      mobilePhone: {
        callingCode: 1,
        countryCode: 'US',
        contact: '5553334444',
      },
      emailAddress: 'jane.data@example.com',
    });
    expect(data.dateOfBirth).to.equal('1990-01-01');
    expect(data.applicantFullName).to.deep.equal({
      first: 'Jane',
      last: 'Doe',
    });

    // ensure flattened fields removed
    expect(data).to.not.have.property('email');
    expect(data).to.not.have.property('dob');
    expect(data).to.not.have.property('homePhone');
    expect(data).to.not.have.property('mobilePhone');
  });

  it('should fallback to profile values when missing from formData', () => {
    const formData = {
      ssn: '999888777',
      mailingAddress: { street: '2 Oak', city: 'Ville', state: 'CA' },
      contactInfo: { homePhone: '7771112222' },
    };

    const state = {
      user: {
        profile: {
          dob: '1977-07-07',
          email: 'profile.fallback@example.com',
          userFullName: { first: 'Fallback', last: 'User' },
          vapContactInfo: {
            homePhone: {
              areaCode: '777',
              countryCode: '1',
              phoneNumber: '1112222',
            },
          },
        },
      },
      data: {},
    };

    const { formData: data } = prefillTransformer(
      pages,
      formData,
      metadata,
      state,
    );

    expect(data.contactInfo).to.deep.equal({
      homePhone: {
        callingCode: 1,
        countryCode: 'US',
        contact: '7771112222',
      },
      mobilePhone: {
        callingCode: 1,
        countryCode: 'US',
        contact: '',
      },
      emailAddress: 'profile.fallback@example.com',
    });
    expect(data.dateOfBirth).to.equal('1977-07-07');
    expect(data.applicantFullName).to.deep.equal({
      first: 'Fallback',
      last: 'User',
    });
  });

  it('should transform bank info from state when formData.bankAccount is absent', () => {
    const formData = {};
    const state = {
      user: { profile: {} },
      data: {
        bankInformation: {
          accountType: 'CHECKING',
          accountNumber: '000111222',
          routingNumber: '121000358',
        },
      },
    };

    const { formData: data } = prefillTransformer(
      pages,
      formData,
      metadata,
      state,
    );

    expect(data.bankAccount).to.deep.equal({
      accountType: 'CHECKING',
      accountNumber: '000111222',
      accountNumberConfirmation: '000111222',
      routingNumber: '121000358',
      routingNumberConfirmation: '121000358',
    });
  });

  it('should prefer formData.bankAccount over state bankInformation', () => {
    const formData = {
      bankAccount: {
        accountType: 'SAVINGS',
        accountNumber: 'ABC12345',
        routingNumber: '999000111',
      },
    };
    const state = {
      user: { profile: {} },
      data: {
        bankInformation: {
          accountType: 'CHECKING',
          accountNumber: 'STATE-111',
          routingNumber: 'STATE-222',
        },
      },
    };

    const { formData: data } = prefillTransformer(
      pages,
      formData,
      metadata,
      state,
    );

    expect(data.bankAccount).to.deep.equal({
      accountType: 'SAVINGS',
      accountNumber: 'ABC12345',
      accountNumberConfirmation: 'ABC12345',
      routingNumber: '999000111',
      routingNumberConfirmation: '999000111',
    });
  });

  it('should not throw if optional nested properties are missing', () => {
    const formData = {};
    const state = { user: { profile: {} }, data: {} };

    const result = prefillTransformer(pages, formData, metadata, state);
    expect(result.formData).to.be.an('object');
  });
});
