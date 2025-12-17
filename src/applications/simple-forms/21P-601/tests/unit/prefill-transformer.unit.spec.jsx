import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

describe('21P-601 prefillTransformer', () => {
  const pages = [];
  const metadata = {};

  describe('formData with backend-provided values', () => {
    it('should preserve claimantFullName from formData', () => {
      const formData = {
        claimantFullName: {
          first: 'Jennifer',
          middle: 'Marie',
          last: 'Smith',
        },
      };
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantFullName.first).to.equal('Jennifer');
      expect(result.formData.claimantFullName.middle).to.equal('Marie');
      expect(result.formData.claimantFullName.last).to.equal('Smith');
    });

    it('should transform claimantSsn to claimantIdentification structure', () => {
      const formData = {
        claimantSsn: '123456789',
      };
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantIdentification.ssn).to.equal('123456789');
      expect(result.formData.claimantIdentification.vaFileNumber).to.equal('');
    });

    it('should preserve claimantAddress from formData', () => {
      const formData = {
        claimantAddress: {
          street: '456 Oak Ave',
          street2: 'Unit 10',
          city: 'Richmond',
          state: 'VA',
          country: 'USA',
          postalCode: '23220',
        },
      };
      const state = {
        user: {
          profile: {},
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

    it('should preserve claimantPhone from formData', () => {
      const formData = {
        claimantPhone: '5551234567',
      };
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantPhone).to.equal('5551234567');
    });

    it('should preserve claimantEmail from formData', () => {
      const formData = {
        claimantEmail: 'jennifer.smith@example.com',
      };
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantEmail).to.equal(
        'jennifer.smith@example.com',
      );
    });

    it('should use dob from user profile for claimantDateOfBirth', () => {
      const formData = {};
      const state = {
        user: {
          profile: {
            dob: '1985-05-15',
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantDateOfBirth).to.equal('1985-05-15');
    });

    it('should handle all backend-provided values together', () => {
      const formData = {
        claimantFullName: {
          first: 'Jennifer',
          middle: 'Marie',
          last: 'Smith',
        },
        claimantSsn: '123456789',
        claimantAddress: {
          street: '123 Main St',
          street2: 'Apt 5',
          city: 'Arlington',
          state: 'VA',
          country: 'USA',
          postalCode: '22201',
        },
        claimantPhone: '5551234567',
        claimantEmail: 'jennifer.smith@example.com',
      };
      const state = {
        user: {
          profile: {
            dob: '1985-05-15',
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantFullName.first).to.equal('Jennifer');
      expect(result.formData.claimantFullName.middle).to.equal('Marie');
      expect(result.formData.claimantFullName.last).to.equal('Smith');
      expect(result.formData.claimantIdentification.ssn).to.equal('123456789');
      expect(result.formData.claimantIdentification.vaFileNumber).to.equal('');
      expect(result.formData.claimantDateOfBirth).to.equal('1985-05-15');
      expect(result.formData.claimantEmail).to.equal(
        'jennifer.smith@example.com',
      );
      expect(result.formData.claimantPhone).to.equal('5551234567');
      expect(result.formData.claimantAddress.street).to.equal('123 Main St');
      expect(result.formData.claimantAddress.street2).to.equal('Apt 5');
      expect(result.formData.claimantAddress.city).to.equal('Arlington');
      expect(result.formData.claimantAddress.state).to.equal('VA');
      expect(result.formData.claimantAddress.country).to.equal('USA');
      expect(result.formData.claimantAddress.postalCode).to.equal('22201');
    });
  });

  describe('empty formData scenarios', () => {
    it('should set empty string for ssn when claimantSsn is not provided', () => {
      const formData = {};
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantIdentification.ssn).to.equal('');
      expect(result.formData.claimantIdentification.vaFileNumber).to.equal('');
    });

    it('should set empty string for claimantDateOfBirth when dob is not available', () => {
      const formData = {};
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantDateOfBirth).to.equal('');
    });
  });

  describe('undefined state handling', () => {
    it('should handle undefined state gracefully', () => {
      const formData = {
        claimantSsn: '123456789',
      };

      const result = prefillTransformer(pages, formData, metadata, undefined);

      expect(result.formData.claimantIdentification.ssn).to.equal('123456789');
      expect(result.formData.claimantDateOfBirth).to.equal('');
    });

    it('should handle undefined user gracefully', () => {
      const formData = {
        claimantSsn: '123456789',
      };
      const state = {
        user: undefined,
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantIdentification.ssn).to.equal('123456789');
      expect(result.formData.claimantDateOfBirth).to.equal('');
    });

    it('should handle undefined profile gracefully', () => {
      const formData = {
        claimantSsn: '123456789',
      };
      const state = {
        user: {
          profile: undefined,
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantIdentification.ssn).to.equal('123456789');
      expect(result.formData.claimantDateOfBirth).to.equal('');
    });

    it('should handle empty profile object', () => {
      const formData = {
        claimantSsn: '123456789',
      };
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData.claimantIdentification.ssn).to.equal('123456789');
      expect(result.formData.claimantDateOfBirth).to.equal('');
    });
  });

  describe('pages and metadata preservation', () => {
    it('should preserve pages parameter', () => {
      const testPages = [{ path: 'test' }];
      const formData = {};
      const state = {};

      const result = prefillTransformer(testPages, formData, metadata, state);

      expect(result.pages).to.equal(testPages);
    });

    it('should preserve metadata parameter', () => {
      const testMetadata = { test: 'value' };
      const formData = {};
      const state = {};

      const result = prefillTransformer(pages, formData, testMetadata, state);

      expect(result.metadata).to.equal(testMetadata);
    });

    it('should return all three required properties', () => {
      const formData = {};
      const state = {};

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result).to.have.property('pages');
      expect(result).to.have.property('formData');
      expect(result).to.have.property('metadata');
    });
  });
});
