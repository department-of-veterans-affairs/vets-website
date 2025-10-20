/**
 * @module tests/config/prefill-transformer.unit.spec
 * @description Unit tests for prefill transformer
 */

import { expect } from 'chai';
import prefillTransformer from './prefill-transformer';

describe('Prefill Transformer', () => {
  const mockPages = [];
  const mockMetadata = { formId: '21-2680' };

  describe('Basic Functionality', () => {
    it('should export a function', () => {
      expect(prefillTransformer).to.be.a('function');
    });

    it('should return an object with pages, formData, and metadata', () => {
      const result = prefillTransformer(mockPages, {}, mockMetadata, {});
      expect(result).to.have.property('pages');
      expect(result).to.have.property('formData');
      expect(result).to.have.property('metadata');
    });

    it('should pass through pages unchanged', () => {
      const result = prefillTransformer(mockPages, {}, mockMetadata, {});
      expect(result.pages).to.equal(mockPages);
    });

    it('should pass through metadata unchanged', () => {
      const result = prefillTransformer(mockPages, {}, mockMetadata, {});
      expect(result.metadata).to.equal(mockMetadata);
    });
  });

  describe('Personal Information', () => {
    it('should transform full name from profile', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'Mara',
              middle: 'Jade',
              last: 'Skywalker',
              suffix: 'Jr',
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.personalInfo.fullName.first).to.equal('Mara');
      expect(result.formData.personalInfo.fullName.middle).to.equal('Jade');
      expect(result.formData.personalInfo.fullName.last).to.equal('Skywalker');
      expect(result.formData.personalInfo.fullName.suffix).to.equal('Jr');
    });

    it('should handle missing name fields with empty strings', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'Luke',
              last: 'Skywalker',
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.personalInfo.fullName.middle).to.equal('');
      expect(result.formData.personalInfo.fullName.suffix).to.equal('');
    });

    it('should format date of birth from YYYYMMDD to YYYY-MM-DD', () => {
      const state = {
        user: {
          profile: {
            dob: '19850312',
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.personalInfo.dateOfBirth).to.equal('1985-03-12');
    });

    it('should use birthDate if dob is not available', () => {
      const state = {
        user: {
          profile: {
            birthDate: '19900615',
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.personalInfo.dateOfBirth).to.equal('1990-06-15');
    });

    it('should pass through already formatted date of birth', () => {
      const state = {
        user: {
          profile: {
            dob: '1975-08-20',
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.personalInfo.dateOfBirth).to.equal('1975-08-20');
    });

    it('should format SSN with dashes', () => {
      const state = {
        user: {
          profile: {
            ssn: '123456789',
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.personalInfo.ssn).to.equal('123-45-6789');
    });

    it('should remove existing SSN formatting before reformatting', () => {
      const state = {
        user: {
          profile: {
            ssn: '123-45-6789',
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.personalInfo.ssn).to.equal('123-45-6789');
    });

    it('should include VA file number if available', () => {
      const state = {
        user: {
          profile: {
            vaFileNumber: 'C12345678',
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.personalInfo.vaFileNumber).to.equal('C12345678');
    });
  });

  describe('Contact Information', () => {
    it('should include email from profile', () => {
      const state = {
        user: {
          profile: {
            email: 'leia.organa@rebellion.com',
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.contactInfo.email).to.equal(
        'leia.organa@rebellion.com',
      );
    });

    it('should prioritize home phone over mobile phone', () => {
      const state = {
        user: {
          profile: {
            homePhone: '5551234567',
            mobilePhone: '5559876543',
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.contactInfo.phone).to.equal('5551234567');
    });

    it('should use mobile phone if home phone is not available', () => {
      const state = {
        user: {
          profile: {
            mobilePhone: '5559876543',
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.contactInfo.phone).to.equal('5559876543');
    });

    it('should transform mailing address from profile', () => {
      const state = {
        user: {
          profile: {
            mailingAddress: {
              addressLine1: '123 Rebel Base',
              addressLine2: 'Hangar 7',
              city: 'Yavin',
              stateCode: 'CA',
              zipCode: '94102',
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.contactInfo.mailingAddress.street).to.equal(
        '123 Rebel Base',
      );
      expect(result.formData.contactInfo.mailingAddress.street2).to.equal(
        'Hangar 7',
      );
      expect(result.formData.contactInfo.mailingAddress.city).to.equal('Yavin');
      expect(result.formData.contactInfo.mailingAddress.state).to.equal('CA');
      expect(result.formData.contactInfo.mailingAddress.postalCode).to.equal(
        '94102',
      );
    });

    it('should use state field if stateCode is not available', () => {
      const state = {
        user: {
          profile: {
            mailingAddress: {
              addressLine1: '123 Main St',
              city: 'Tatooine',
              state: 'NY',
              zipCode: '10001',
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.contactInfo.mailingAddress.state).to.equal('NY');
    });
  });

  describe('Empty and Missing Data', () => {
    it('should handle empty state object', () => {
      const result = prefillTransformer(mockPages, {}, mockMetadata, {});
      expect(result.formData).to.exist;
      expect(result.formData.personalInfo).to.exist;
      expect(result.formData.contactInfo).to.exist;
    });

    it('should handle missing user profile', () => {
      const state = { user: {} };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData).to.exist;
    });

    it('should return empty string for missing SSN', () => {
      const state = { user: { profile: {} } };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.personalInfo.ssn).to.equal('');
    });

    it('should return empty string for missing date of birth', () => {
      const state = { user: { profile: {} } };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.personalInfo.dateOfBirth).to.equal('');
    });
  });

  describe('Preserving Existing Form Data', () => {
    it('should preserve existing form data', () => {
      const existingData = {
        customField: 'custom value',
        anotherField: 123,
      };
      const result = prefillTransformer(
        mockPages,
        existingData,
        mockMetadata,
        {},
      );
      expect(result.formData.customField).to.equal('custom value');
      expect(result.formData.anotherField).to.equal(123);
    });

    it('should merge prefilled data with existing data', () => {
      const existingData = {
        existingField: 'existing',
      };
      const state = {
        user: {
          profile: {
            email: 'test@example.com',
          },
        },
      };
      const result = prefillTransformer(
        mockPages,
        existingData,
        mockMetadata,
        state,
      );
      expect(result.formData.existingField).to.equal('existing');
      expect(result.formData.contactInfo.email).to.equal('test@example.com');
    });
  });
});
