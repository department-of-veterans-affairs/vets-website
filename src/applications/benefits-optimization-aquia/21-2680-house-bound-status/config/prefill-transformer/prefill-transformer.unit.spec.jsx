/**
 * @module tests/config/prefill-transformer.unit.spec
 * @description Unit tests for prefill transformer
 */

import { expect } from 'chai';
import { prefillTransformer } from './prefill-transformer';

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
      expect(result.formData.veteranInformation.veteranFullName.first).to.equal(
        'Mara',
      );
      expect(
        result.formData.veteranInformation.veteranFullName.middle,
      ).to.equal('Jade');
      expect(result.formData.veteranInformation.veteranFullName.last).to.equal(
        'Skywalker',
      );
      expect(
        result.formData.veteranInformation.veteranFullName.suffix,
      ).to.equal('Jr');
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
      expect(
        result.formData.veteranInformation.veteranFullName.middle,
      ).to.equal('');
      expect(
        result.formData.veteranInformation.veteranFullName.suffix,
      ).to.equal('');
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
      expect(result.formData.veteranInformation.veteranDob).to.equal(
        '1985-03-12',
      );
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
      expect(result.formData.veteranInformation.veteranDob).to.equal(
        '1990-06-15',
      );
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
      expect(result.formData.veteranInformation.veteranDob).to.equal(
        '1975-08-20',
      );
    });

    it('should not prefill SSN for security reasons', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'John',
              last: 'Doe',
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.veteranInformation.veteranSsn).to.equal('');
    });

    it('should use vaProfile.birthDate if profile.dob and profile.birthDate are not available', () => {
      const state = {
        user: {
          profile: {
            vaProfile: {
              birthDate: '19800101',
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.veteranInformation.veteranDob).to.equal(
        '1980-01-01',
      );
    });
  });

  describe('Address Information', () => {
    it('should transform mailing address from vapContactInfo (primary source)', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {
              mailingAddress: {
                addressLine1: '123 Rebel Base',
                addressLine2: 'Hangar 7',
                addressLine3: 'Sector 3',
                city: 'Yavin',
                stateCode: 'CA',
                zipCode: '94102',
                zipCodeSuffix: '1234',
                countryCodeIso3: 'USA',
              },
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.veteranAddress.veteranAddress.street).to.equal(
        '123 Rebel Base',
      );
      expect(result.formData.veteranAddress.veteranAddress.street2).to.equal(
        'Hangar 7',
      );
      expect(result.formData.veteranAddress.veteranAddress.street3).to.equal(
        'Sector 3',
      );
      expect(result.formData.veteranAddress.veteranAddress.city).to.equal(
        'Yavin',
      );
      expect(result.formData.veteranAddress.veteranAddress.state).to.equal(
        'CA',
      );
      expect(result.formData.veteranAddress.veteranAddress.postalCode).to.equal(
        '94102-1234',
      );
      expect(result.formData.veteranAddress.veteranAddress.country).to.equal(
        'USA',
      );
      expect(result.formData.veteranAddress.veteranAddress.isMilitary).to.equal(
        false,
      );
    });

    it('should fallback to vet360ContactInformation if vapContactInfo is not available', () => {
      const state = {
        user: {
          profile: {
            vet360ContactInformation: {
              mailingAddress: {
                addressLine1: '456 Empire St',
                city: 'Coruscant',
                stateCode: 'NY',
                zipCode: '10001',
              },
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.veteranAddress.veteranAddress.street).to.equal(
        '456 Empire St',
      );
      expect(result.formData.veteranAddress.veteranAddress.city).to.equal(
        'Coruscant',
      );
    });

    it('should fallback to profile.mailingAddress if vapContactInfo is not available', () => {
      const state = {
        user: {
          profile: {
            mailingAddress: {
              addressLine1: '789 Senate Bldg',
              addressLine2: 'Floor 12',
              city: 'Naboo',
              stateCode: 'TX',
              zipCode: '75001',
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.veteranAddress.veteranAddress.street).to.equal(
        '789 Senate Bldg',
      );
      expect(result.formData.veteranAddress.veteranAddress.street2).to.equal(
        'Floor 12',
      );
      expect(result.formData.veteranAddress.veteranAddress.city).to.equal(
        'Naboo',
      );
      expect(result.formData.veteranAddress.veteranAddress.state).to.equal(
        'TX',
      );
    });

    it('should fallback to vaProfile.vet360ContactInformation if other sources not available', () => {
      const state = {
        user: {
          profile: {
            vaProfile: {
              vet360ContactInformation: {
                mailingAddress: {
                  addressLine1: '999 Jedi Temple',
                  city: 'Coruscant',
                  stateCode: 'DC',
                  postalCode: '20001',
                },
              },
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.veteranAddress.veteranAddress.street).to.equal(
        '999 Jedi Temple',
      );
      expect(result.formData.veteranAddress.veteranAddress.city).to.equal(
        'Coruscant',
      );
      expect(result.formData.veteranAddress.veteranAddress.postalCode).to.equal(
        '20001',
      );
    });

    it('should use state field if stateCode is not available', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {
              mailingAddress: {
                addressLine1: '123 Main St',
                city: 'Tatooine',
                state: 'NY',
                zipCode: '10001',
              },
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.veteranAddress.veteranAddress.state).to.equal(
        'NY',
      );
    });

    it('should handle zipCode without suffix', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {
              mailingAddress: {
                addressLine1: '123 Main St',
                city: 'Springfield',
                stateCode: 'IL',
                zipCode: '62701',
              },
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.veteranAddress.veteranAddress.postalCode).to.equal(
        '62701',
      );
    });

    it('should use postalCode if zipCode is not available', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {
              mailingAddress: {
                addressLine1: '123 Main St',
                city: 'Springfield',
                stateCode: 'IL',
                postalCode: '62702',
              },
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.veteranAddress.veteranAddress.postalCode).to.equal(
        '62702',
      );
    });

    it('should use countryName if countryCodeIso3 is not available', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {
              mailingAddress: {
                addressLine1: '123 Main St',
                city: 'Toronto',
                stateCode: 'ON',
                zipCode: 'M5H',
                countryName: 'Canada',
              },
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.veteranAddress.veteranAddress.country).to.equal(
        'Canada',
      );
    });

    it('should default country to USA if not provided', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {
              mailingAddress: {
                addressLine1: '123 Main St',
                city: 'Springfield',
                stateCode: 'IL',
                zipCode: '62701',
              },
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.veteranAddress.veteranAddress.country).to.equal(
        'USA',
      );
    });

    it('should handle missing address lines gracefully', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {
              mailingAddress: {
                addressLine1: '123 Main St',
                city: 'Springfield',
                stateCode: 'IL',
                zipCode: '62701',
              },
            },
          },
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.veteranAddress.veteranAddress.street2).to.equal(
        '',
      );
      expect(result.formData.veteranAddress.veteranAddress.street3).to.equal(
        '',
      );
    });

    it('should return empty address object when no address source is available', () => {
      const state = {
        user: {
          profile: {},
        },
      };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.veteranAddress.veteranAddress).to.deep.equal({});
    });
  });

  describe('Empty and Missing Data', () => {
    it('should handle empty state object', () => {
      const result = prefillTransformer(mockPages, {}, mockMetadata, {});
      expect(result.formData).to.exist;
      expect(result.formData.veteranInformation).to.exist;
      expect(result.formData.veteranAddress).to.exist;
    });

    it('should handle missing user profile', () => {
      const state = { user: {} };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData).to.exist;
    });

    it('should return empty string for missing SSN', () => {
      const state = { user: { profile: {} } };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.veteranInformation.veteranSsn).to.equal('');
    });

    it('should return empty string for missing date of birth', () => {
      const state = { user: { profile: {} } };
      const result = prefillTransformer(mockPages, {}, mockMetadata, state);
      expect(result.formData.veteranInformation.veteranDob).to.equal('');
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
            userFullName: {
              first: 'Rex',
              last: 'CT-7567',
            },
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
      expect(result.formData.veteranInformation.veteranFullName.first).to.equal(
        'Rex',
      );
      expect(result.formData.veteranInformation.veteranFullName.last).to.equal(
        'CT-7567',
      );
    });
  });
});
