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
              first: 'Anakin',
              middle: '',
              last: 'Skywalker',
              suffix: 'General',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.fullName).to.deep.equal({
        first: 'Anakin',
        middle: '',
        last: 'Skywalker',
        suffix: 'General',
      });
    });

    it('should handle missing name components', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'Anakin',
              last: 'Skywalker',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.fullName).to.deep.equal({
        first: 'Anakin',
        middle: '',
        last: 'Skywalker',
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
            dob: '19410504',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.dateOfBirth).to.equal('1941-05-04');
    });

    it('should use already formatted date', () => {
      const state = {
        user: {
          profile: {
            dob: '1941-05-04',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.dateOfBirth).to.equal('1941-05-04');
    });

    it('should use birthDate field if dob is not present', () => {
      const state = {
        user: {
          profile: {
            birthDate: '19410504',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.dateOfBirth).to.equal('1941-05-04');
    });

    it('should prefer dob over birthDate', () => {
      const state = {
        user: {
          profile: {
            dob: '19410504',
            birthDate: '19420101',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.dateOfBirth).to.equal('1941-05-04');
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
            ssn: '501667138',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.ssn).to.equal('501-66-7138');
    });

    it('should remove existing SSN formatting before reformatting', () => {
      const state = {
        user: {
          profile: {
            ssn: '501-66-7138',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.ssn).to.equal('501-66-7138');
    });

    it('should handle SSN with spaces', () => {
      const state = {
        user: {
          profile: {
            ssn: '501 66 7138',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.ssn).to.equal('501-66-7138');
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
            vaFileNumber: '22387563',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo.vaFileNumber).to.equal('22387563');
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
            homePhone: '5550138666',
            email: 'memorial@jedicouncil.coruscant',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.phone).to.equal('5550138666');
      expect(result.formData.contactInfo.email).to.equal(
        'memorial@jedicouncil.coruscant',
      );
    });

    it('should prefer home phone over mobile phone', () => {
      const state = {
        user: {
          profile: {
            homePhone: '5550138666',
            mobilePhone: '5552127748',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.phone).to.equal('5550138666');
    });

    it('should use mobile phone if home phone is not available', () => {
      const state = {
        user: {
          profile: {
            mobilePhone: '5552127748',
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.phone).to.equal('5552127748');
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
              addressLine1: '1138 Temple Way',
              addressLine2: 'High Council Chambers',
              city: 'Coruscant City',
              stateCode: 'DC',
              zipCode: '20001',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.mailingAddress).to.deep.equal({
        street: '1138 Temple Way',
        street2: 'High Council Chambers',
        city: 'Coruscant City',
        state: 'DC',
        postalCode: '20001',
      });
    });

    it('should use state field if stateCode is not available', () => {
      const state = {
        user: {
          profile: {
            mailingAddress: {
              addressLine1: '1138 Temple Way',
              city: 'Coruscant City',
              state: 'District of Coruscant',
              zipCode: '20001',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.contactInfo.mailingAddress.state).to.equal(
        'District of Coruscant',
      );
    });

    it('should handle missing address line 2', () => {
      const state = {
        user: {
          profile: {
            mailingAddress: {
              addressLine1: '1138 Temple Way',
              city: 'Coruscant City',
              stateCode: 'DC',
              zipCode: '20001',
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
              first: 'Anakin',
              last: 'Skywalker',
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
            email: 'memorial@jedicouncil.coruscant',
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
        'memorial@jedicouncil.coruscant',
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
              first: 'Leia',
              middle: 'Amidala',
              last: 'Organa Solo',
              suffix: 'Senator',
            },
            dob: '19650525',
            ssn: '212774881',
            vaFileNumber: '21277488',
            homePhone: '5552127748',
            email: 'senator.organa@alderaan.gov',
            mailingAddress: {
              addressLine1: '2187 Royal Palace Drive',
              addressLine2: 'Suite 100',
              city: 'Aldera',
              stateCode: 'NY',
              zipCode: '10001',
            },
          },
        },
      };

      const result = prefillTransformer(mockPages, {}, mockMetadata, state);

      expect(result.formData.personalInfo).to.deep.equal({
        fullName: {
          first: 'Leia',
          middle: 'Amidala',
          last: 'Organa Solo',
          suffix: 'Senator',
        },
        dateOfBirth: '1965-05-25',
        ssn: '212-77-4881',
        vaFileNumber: '21277488',
      });

      expect(result.formData.contactInfo).to.deep.equal({
        phone: '5552127748',
        email: 'senator.organa@alderaan.gov',
        mailingAddress: {
          street: '2187 Royal Palace Drive',
          street2: 'Suite 100',
          city: 'Aldera',
          state: 'NY',
          postalCode: '10001',
        },
      });
    });
  });
});
