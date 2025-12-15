/**
 * @module tests/config/prefill-transformer.unit.spec
 * @description Unit tests for prefill transformer
 */

import { expect } from 'chai';
import { prefillTransformer } from './prefill-transformer';

describe('prefillTransformer', () => {
  const mockPages = [];
  const mockMetadata = { formId: '21-4192' };

  describe('Full Name Transformation', () => {
    it('should transform complete complete name', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'Boba',
              middle: 'Jaster',
              last: 'Fett',
              suffix: 'Captain',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.fullName.first).to.equal('Boba');
      expect(result.formData.personalInfo.fullName.middle).to.equal('Jaster');
      expect(result.formData.personalInfo.fullName.last).to.equal('Fett');
      expect(result.formData.personalInfo.fullName.suffix).to.equal('Captain');
    });

    it('should handle name without middle name', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'Cad',
              last: 'Bane',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.fullName.first).to.equal('Cad');
      expect(result.formData.personalInfo.fullName.middle).to.equal('');
      expect(result.formData.personalInfo.fullName.last).to.equal('Bane');
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
    it('should transform YYYYMMDD date format', () => {
      const state = {
        user: {
          profile: {
            dob: '19850322',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.dateOfBirth).to.equal('1985-03-22');
    });

    it('should preserve YYYY-MM-DD format', () => {
      const state = {
        user: {
          profile: {
            dob: '1985-03-22',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.dateOfBirth).to.equal('1985-03-22');
    });

    it('should use birthDate when dob is not available', () => {
      const state = {
        user: {
          profile: {
            birthDate: '19580106',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.dateOfBirth).to.equal('1958-01-06');
    });

    it('should use vaProfile birthDate as fallback', () => {
      const state = {
        user: {
          profile: {
            vaProfile: {
              birthDate: '19620713',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.dateOfBirth).to.equal('1962-07-13');
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

    it('should remove existing formatting before reformatting', () => {
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
    it('should extract VA file number', () => {
      const state = {
        user: {
          profile: {
            vaFileNumber: '12345678',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.vaFileNumber).to.equal('12345678');
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
    it('should prioritize home phone', () => {
      const state = {
        user: {
          profile: {
            homePhone: '4155551234',
            mobilePhone: '4155559876',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.phone).to.equal('4155551234');
    });

    it('should use mobile phone if home phone not available', () => {
      const state = {
        user: {
          profile: {
            mobilePhone: '4155559876',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.phone).to.equal('4155559876');
    });

    it('should extract email from Guild account', () => {
      const state = {
        user: {
          profile: {
            email: 'james.kirk@starfleet.fed',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.email).to.equal(
        'james.kirk@starfleet.fed',
      );
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
    it('should transform complete Guild address', () => {
      const state = {
        user: {
          profile: {
            mailingAddress: {
              addressLine1: 'Guild Headquarters',
              addressLine2: 'Building One',
              city: 'San Francisco',
              stateCode: 'CA',
              zipCode: '94102',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.mailingAddress.street).to.equal(
        'Guild Headquarters',
      );
      expect(result.formData.contactInfo.mailingAddress.street2).to.equal(
        'Building One',
      );
      expect(result.formData.contactInfo.mailingAddress.city).to.equal(
        'San Francisco',
      );
      expect(result.formData.contactInfo.mailingAddress.state).to.equal('CA');
      expect(result.formData.contactInfo.mailingAddress.postalCode).to.equal(
        '94102',
      );
    });

    it('should handle address with state name instead of code', () => {
      const state = {
        user: {
          profile: {
            mailingAddress: {
              addressLine1: '123 Main St',
              city: 'San Francisco',
              state: 'California',
              zipCode: '94102',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.mailingAddress.state).to.equal(
        'California',
      );
    });

    it('should prioritize stateCode over state', () => {
      const state = {
        user: {
          profile: {
            mailingAddress: {
              addressLine1: '123 Main St',
              city: 'San Francisco',
              stateCode: 'CA',
              state: 'California',
              zipCode: '94102',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.mailingAddress.state).to.equal('CA');
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

  describe('Complete Profile', () => {
    it('should transform Boba Fett complete profile', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'Boba',
              middle: 'Tiberius',
              last: 'Fett',
            },
            dob: '19850322',
            ssn: '123456789',
            vaFileNumber: '12345678',
            email: 'james.kirk@starfleet.fed',
            homePhone: '4155551701',
            mailingAddress: {
              addressLine1: 'Slave I',
              city: 'Nar Shaddaa',
              stateCode: 'CA',
              zipCode: '90210',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.fullName.first).to.equal('Boba');
      expect(result.formData.personalInfo.dateOfBirth).to.equal('1985-03-22');
      expect(result.formData.personalInfo.ssn).to.equal('123-45-6789');
      expect(result.formData.personalInfo.vaFileNumber).to.equal('12345678');
      expect(result.formData.contactInfo.email).to.equal(
        'james.kirk@starfleet.fed',
      );
      expect(result.formData.contactInfo.phone).to.equal('4155551701');
      expect(result.formData.contactInfo.mailingAddress.street).to.equal(
        'Slave I',
      );
    });
  });

  describe('Form Data Preservation', () => {
    it('should preserve existing form data', () => {
      const existingFormData = {
        someField: 'existing value',
      };

      const state = {
        user: {
          profile: {
            userFullName: { first: 'Boba', last: 'Fett' },
          },
        },
      };

      const result = prefillTransformer(
        mockPages,
        existingFormData,
        mockMetadata,
        state,
      );

      expect(result.formData.someField).to.equal('existing value');
    });
  });

  describe('Return Structure', () => {
    it('should return pages, formData, and metadata', () => {
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result).to.have.property('pages');
      expect(result).to.have.property('formData');
      expect(result).to.have.property('metadata');
    });
  });

  describe('Edge Cases', () => {
    it('should handle completely empty state', () => {
      const state = {};

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo).to.exist;
      expect(result.formData.contactInfo).to.exist;
    });

    it('should handle null user', () => {
      const state = {
        user: null,
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo).to.exist;
    });

    it('should handle undefined profile', () => {
      const state = {
        user: {
          profile: undefined,
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo).to.exist;
    });
  });
});
