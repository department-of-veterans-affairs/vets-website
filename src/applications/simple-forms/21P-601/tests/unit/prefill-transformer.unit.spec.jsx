import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

describe('21P-601 prefillTransformer', () => {
  const pages = [];
  const formData = {};
  const metadata = {};

  describe('authenticated user with complete profile', () => {
    it('should prefill data from user profile', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'Jennifer',
              middle: 'Marie',
              last: 'Smith',
            },
            ssn: '123456789',
            vaFileNumber: '987654321',
            dob: '1985-05-15',
            email: 'jennifer.smith@example.com',
            homePhone: '5551234567',
            mailingAddress: {
              addressLine1: '123 Main St',
              addressLine2: 'Apt 5',
              city: 'Arlington',
              stateCode: 'VA',
              countryCodeIso3: 'USA',
              zipCode: '22201',
            },
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantFullName.first).to.equal('Jennifer');
      expect(result.formData.claimantFullName.middle).to.equal('Marie');
      expect(result.formData.claimantFullName.last).to.equal('Smith');
      expect(result.formData.claimantIdentification.ssn).to.equal('123456789');
      expect(result.formData.claimantIdentification.vaFileNumber).to.equal(
        '987654321',
      );
      expect(result.formData.claimantDateOfBirth).to.equal('1985-05-15');
      expect(result.formData.claimantEmail).to.equal(
        'jennifer.smith@example.com',
      );
      expect(result.formData.claimantPhone).to.equal('5551234567');
    });

    it('should prefill address correctly', () => {
      const state = {
        user: {
          profile: {
            mailingAddress: {
              addressLine1: '456 Oak Ave',
              addressLine2: 'Unit 10',
              city: 'Richmond',
              stateCode: 'VA',
              countryCodeIso3: 'USA',
              zipCode: '23220',
            },
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantAddress.street).to.equal('456 Oak Ave');
      expect(result.formData.claimantAddress.street2).to.equal('Unit 10');
      expect(result.formData.claimantAddress.city).to.equal('Richmond');
      expect(result.formData.claimantAddress.state).to.equal('VA');
      expect(result.formData.claimantAddress.country).to.equal('USA');
      expect(result.formData.claimantAddress.postalCode).to.equal('23220');
    });

    it('should use mobilePhone if homePhone is not available', () => {
      const state = {
        user: {
          profile: {
            mobilePhone: '7035559999',
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantPhone).to.equal('7035559999');
    });
  });

  describe('unauthenticated user', () => {
    it('should return empty data when profile is undefined', () => {
      const state = {
        user: {
          profile: undefined,
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantFullName).to.deep.equal({});
      expect(result.formData.claimantEmail).to.equal('');
      expect(result.formData.claimantPhone).to.equal('');
    });

    it('should return empty data when user is undefined', () => {
      const state = {
        user: undefined,
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantFullName).to.deep.equal({});
    });

    it('should return empty data when state is undefined', () => {
      const result = prefillTransformer(pages, formData, metadata, undefined);

      expect(result.formData.claimantFullName).to.deep.equal({});
    });

    it('should return empty data when profile is empty object', () => {
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantFullName).to.deep.equal({});
    });
  });

  describe('partial profile data', () => {
    it('should handle missing email', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'John',
              last: 'Doe',
            },
            homePhone: '5551234567',
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantFullName.first).to.equal('John');
      expect(result.formData.claimantFullName.last).to.equal('Doe');
      expect(result.formData.claimantEmail).to.equal('');
      expect(result.formData.claimantPhone).to.equal('5551234567');
    });

    it('should handle missing phone number', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'John',
              last: 'Doe',
            },
            email: 'john.doe@example.com',
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantFullName.first).to.equal('John');
      expect(result.formData.claimantFullName.last).to.equal('Doe');
      expect(result.formData.claimantEmail).to.equal('john.doe@example.com');
      expect(result.formData.claimantPhone).to.equal('');
    });

    it('should handle missing address fields', () => {
      const state = {
        user: {
          profile: {
            mailingAddress: {
              city: 'Norfolk',
              stateCode: 'VA',
            },
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantAddress.street).to.equal('');
      expect(result.formData.claimantAddress.street2).to.equal('');
      expect(result.formData.claimantAddress.city).to.equal('Norfolk');
      expect(result.formData.claimantAddress.state).to.equal('VA');
    });
  });

  describe('pages and metadata preservation', () => {
    it('should preserve pages parameter', () => {
      const testPages = [{ path: 'test' }];
      const state = {};

      const result = prefillTransformer(testPages, formData, metadata, state);

      expect(result.pages).to.equal(testPages);
    });

    it('should preserve metadata parameter', () => {
      const testMetadata = { test: 'value' };
      const state = {};

      const result = prefillTransformer(pages, formData, testMetadata, state);

      expect(result.metadata).to.equal(testMetadata);
    });

    it('should return all three required properties', () => {
      const state = {};

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result).to.have.property('pages');
      expect(result).to.have.property('formData');
      expect(result).to.have.property('metadata');
    });
  });

  describe('veteran information initialization', () => {
    it('should initialize veteran information as empty', () => {
      const state = {
        user: {
          profile: {
            userFullName: { first: 'Test', last: 'User' },
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.veteranFullName).to.deep.equal({});
      expect(result.formData.veteranIdentification.ssn).to.equal('');
    });
  });
});
