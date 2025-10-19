/**
 * @module tests/config/prefill-transformer.unit.spec
 * @description Unit tests for prefill transformer
 */

import { expect } from 'chai';
import prefillTransformer from './prefill-transformer';

describe('Prefill Transformer', () => {
  const mockPages = [{ pageKey: 'page1' }];
  const mockMetadata = { formId: '21P-530A' };

  describe('Basic Structure', () => {
    it('should export a function', () => {
      expect(prefillTransformer).to.be.a('function');
    });

    it('should return an object with pages, formData, and metadata', () => {
      const result = prefillTransformer(mockPages, {}, mockMetadata, {});

      expect(result).to.be.an('object');
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

  describe('Full Name Transformation', () => {
    it('should transform user full name from profile', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'John',
              middle: 'M',
              last: 'Smith',
              suffix: 'Jr',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.fullName).to.deep.equal({
        first: 'John',
        middle: 'M',
        last: 'Smith',
        suffix: 'Jr',
      });
    });

    it('should handle missing name components', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'John',
              last: 'Smith',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.fullName).to.deep.equal({
        first: 'John',
        middle: '',
        last: 'Smith',
        suffix: '',
      });
    });

    it('should handle missing userFullName', () => {
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.fullName).to.deep.equal({});
    });
  });

  describe('Date of Birth Transformation', () => {
    it('should format YYYYMMDD date to YYYY-MM-DD', () => {
      const state = {
        user: {
          profile: {
            dob: '19800515',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.dateOfBirth).to.equal('1980-05-15');
    });

    it('should use already formatted date', () => {
      const state = {
        user: {
          profile: {
            dob: '1980-05-15',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.dateOfBirth).to.equal('1980-05-15');
    });

    it('should use birthDate field if dob is not present', () => {
      const state = {
        user: {
          profile: {
            birthDate: '19800515',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.dateOfBirth).to.equal('1980-05-15');
    });

    it('should prefer dob over birthDate', () => {
      const state = {
        user: {
          profile: {
            dob: '19800515',
            birthDate: '19900101',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.dateOfBirth).to.equal('1980-05-15');
    });

    it('should handle missing date of birth', () => {
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.dateOfBirth).to.equal('');
    });
  });

  describe('SSN Transformation', () => {
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

    it('should handle SSN with spaces', () => {
      const state = {
        user: {
          profile: {
            ssn: '123 45 6789',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.ssn).to.equal('123-45-6789');
    });

    it('should handle missing SSN', () => {
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.ssn).to.equal('');
    });
  });

  describe('VA File Number', () => {
    it('should include VA file number from profile', () => {
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

    it('should handle missing VA file number', () => {
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.vaFileNumber).to.equal('');
    });
  });

  describe('Contact Information', () => {
    it('should include phone and email from profile', () => {
      const state = {
        user: {
          profile: {
            homePhone: '5551234567',
            email: 'john.smith@example.com',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.phone).to.equal('5551234567');
      expect(result.formData.contactInfo.email).to.equal(
        'john.smith@example.com',
      );
    });

    it('should prefer home phone over mobile phone', () => {
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

    it('should handle missing contact information', () => {
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.phone).to.equal('');
      expect(result.formData.contactInfo.email).to.equal('');
    });
  });

  describe('Mailing Address Transformation', () => {
    it('should transform mailing address from profile', () => {
      const state = {
        user: {
          profile: {
            mailingAddress: {
              addressLine1: '123 Main St',
              addressLine2: 'Apt 4B',
              city: 'Springfield',
              stateCode: 'IL',
              zipCode: '62701',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.mailingAddress).to.deep.equal({
        street: '123 Main St',
        street2: 'Apt 4B',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      });
    });

    it('should use state field if stateCode is not available', () => {
      const state = {
        user: {
          profile: {
            mailingAddress: {
              addressLine1: '123 Main St',
              city: 'Springfield',
              state: 'Illinois',
              zipCode: '62701',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.mailingAddress.state).to.equal(
        'Illinois',
      );
    });

    it('should handle missing address line 2', () => {
      const state = {
        user: {
          profile: {
            mailingAddress: {
              addressLine1: '123 Main St',
              city: 'Springfield',
              stateCode: 'IL',
              zipCode: '62701',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.mailingAddress.street2).to.equal('');
    });

    it('should handle missing mailing address', () => {
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.mailingAddress).to.deep.equal({});
    });
  });

  describe('Existing Form Data Preservation', () => {
    it('should preserve existing form data', () => {
      const existingFormData = {
        someExistingField: 'existing value',
        anotherField: 123,
      };

      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'John',
              last: 'Smith',
            },
          },
        },
      };

      const result = prefillTransformer(
        mockPages,
        existingFormData,
        mockMetadata,
        state,
      );

      expect(result.formData.someExistingField).to.equal('existing value');
      expect(result.formData.anotherField).to.equal(123);
    });

    it('should merge prefilled data with existing form data', () => {
      const existingFormData = {
        someField: 'value',
      };

      const state = {
        user: {
          profile: {
            email: 'john.smith@example.com',
          },
        },
      };

      const result = prefillTransformer(
        mockPages,
        existingFormData,
        mockMetadata,
        state,
      );

      expect(result.formData.someField).to.equal('value');
      expect(result.formData.contactInfo.email).to.equal(
        'john.smith@example.com',
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined state', () => {
      const result = prefillTransformer(mockPages, {}, mockMetadata, undefined);

      expect(result.formData.personalInfo.fullName).to.deep.equal({});
      expect(result.formData.personalInfo.dateOfBirth).to.equal('');
      expect(result.formData.contactInfo.phone).to.equal('');
    });

    it('should handle state without user', () => {
      const result = prefillTransformer(mockPages, {}, mockMetadata, {});

      expect(result.formData.personalInfo.fullName).to.deep.equal({});
      expect(result.formData.personalInfo.dateOfBirth).to.equal('');
      expect(result.formData.contactInfo.phone).to.equal('');
    });

    it('should handle state without user profile', () => {
      const state = {
        user: {},
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.fullName).to.deep.equal({});
      expect(result.formData.personalInfo.dateOfBirth).to.equal('');
      expect(result.formData.contactInfo.phone).to.equal('');
    });

    it('should handle complete profile data', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'Mary',
              middle: 'Jane',
              last: 'Williams',
              suffix: 'Sr',
            },
            dob: '19600910',
            ssn: '321654987',
            vaFileNumber: 'C98765432',
            homePhone: '5551112222',
            email: 'mary.williams@example.com',
            mailingAddress: {
              addressLine1: '456 Oak Ave',
              addressLine2: 'Suite 100',
              city: 'Chicago',
              stateCode: 'IL',
              zipCode: '60601',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo).to.deep.equal({
        fullName: {
          first: 'Mary',
          middle: 'Jane',
          last: 'Williams',
          suffix: 'Sr',
        },
        dateOfBirth: '1960-09-10',
        ssn: '321-65-4987',
        vaFileNumber: 'C98765432',
      });

      expect(result.formData.contactInfo).to.deep.equal({
        phone: '5551112222',
        email: 'mary.williams@example.com',
        mailingAddress: {
          street: '456 Oak Ave',
          street2: 'Suite 100',
          city: 'Chicago',
          state: 'IL',
          postalCode: '60601',
        },
      });
    });
  });
});
