import { expect } from 'chai';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import { addToxicExposure } from '../../utils/submit';

describe('addToxicExposure', () => {
  describe('when user has no toxic exposure data', () => {
    it('should return the form data unchanged', () => {
      const formData = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        veteranInformation: { name: 'John Doe' },
      };

      const result = addToxicExposure(formData);

      expect(result).to.deep.equal(formData);
    });
  });

  describe('when user has toxic exposure data but no conditions', () => {
    it('should return the form data unchanged', () => {
      const formData = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          gulfWar1990: { bahrain: true },
          herbicide: { vietnam: true },
        },
      };

      const result = addToxicExposure(formData);

      expect(result).to.deep.equal(formData);
    });
  });

  describe('when user has toxic exposure conditions selected (not "none")', () => {
    it('should return all toxic exposure data unchanged', () => {
      const formData = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          conditions: {
            chronicbronchitis: true,
            asthma: true,
          },
          gulfWar1990: { bahrain: true },
          gulfWar1990Details: {
            bahrain: {
              startDate: '1991-01-01',
              endDate: '1991-12-31',
            },
          },
          herbicide: { vietnam: true },
          herbicideDetails: {
            vietnam: {
              startDate: '1968-01-01',
              endDate: '1970-01-01',
            },
          },
          additionalExposures: { asbestos: true },
          specifyOtherExposures: 'Lead exposure',
        },
      };

      const result = addToxicExposure(formData);

      expect(result).to.deep.equal(formData);
    });
  });

  describe('when user has mixed conditions including "none"', () => {
    it('should return all toxic exposure data unchanged', () => {
      const formData = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          conditions: {
            chronicbronchitis: true,
            none: true,
          },
          gulfWar1990: { bahrain: true },
          herbicide: { vietnam: true },
        },
      };

      const result = addToxicExposure(formData);

      expect(result).to.deep.equal(formData);
    });
  });

  describe('when user selected only "none" for toxic exposure conditions', () => {
    it('should remove all toxic exposure data except the "none" condition', () => {
      const formData = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        veteranInformation: { name: 'John Doe' },
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: {
            bahrain: true,
            airspace: true,
          },
          gulfWar1990Details: {
            bahrain: {
              startDate: '1991-01-01',
              endDate: '1991-12-31',
            },
          },
          gulfWar2001: {
            afghanistan: true,
          },
          gulfWar2001Details: {
            afghanistan: {
              startDate: '2001-10-01',
              endDate: '2002-10-01',
            },
          },
          herbicide: {
            vietnam: true,
          },
          herbicideDetails: {
            vietnam: {
              startDate: '1968-01-01',
              endDate: '1970-01-01',
            },
          },
          herbicideOtherLocations: 'Other herbicide location',
          additionalExposures: {
            asbestos: true,
            radiation: true,
          },
          additionalExposuresDetails: {
            asbestos: {
              startDate: '1980-01-01',
              endDate: '1985-01-01',
            },
          },
          specifyOtherExposures: 'Lead exposure from paint',
        },
      };

      const expectedResult = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        veteranInformation: { name: 'John Doe' },
        toxicExposure: {
          conditions: { none: true },
        },
      };

      const result = addToxicExposure(formData);

      expect(result).to.deep.equal(expectedResult);
    });

    it('should preserve other form data outside of toxic exposure', () => {
      const formData = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        veteranInformation: { name: 'John Doe' },
        ratedDisabilities: [{ name: 'Existing condition' }],
        privateMedicalRecords: { hasRecords: true },
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: { bahrain: true },
          herbicide: { vietnam: true },
        },
      };

      const result = addToxicExposure(formData);

      // Should preserve all non-toxic exposure data
      expect(result.newDisabilities).to.deep.equal(formData.newDisabilities);
      expect(result.veteranInformation).to.deep.equal(
        formData.veteranInformation,
      );
      expect(result.ratedDisabilities).to.deep.equal(
        formData.ratedDisabilities,
      );
      expect(result.privateMedicalRecords).to.deep.equal(
        formData.privateMedicalRecords,
      );

      // Should only keep conditions with "none" selected
      expect(result.toxicExposure).to.deep.equal({
        conditions: { none: true },
      });
    });

    it('should not mutate the original form data', () => {
      const originalFormData = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: { bahrain: true },
          herbicide: { vietnam: true },
        },
      };

      const formDataCopy = cloneDeep(originalFormData);

      addToxicExposure(originalFormData);

      // Original data should remain unchanged
      expect(originalFormData).to.deep.equal(formDataCopy);
    });
  });

  describe('edge cases', () => {
    it('should handle empty conditions object', () => {
      const formData = {
        toxicExposure: {
          conditions: {},
          gulfWar1990: { bahrain: true },
        },
      };

      const result = addToxicExposure(formData);

      expect(result).to.deep.equal(formData);
    });

    it('should handle undefined toxicExposure.conditions', () => {
      const formData = {
        toxicExposure: {
          gulfWar1990: { bahrain: true },
        },
      };

      const result = addToxicExposure(formData);

      expect(result).to.deep.equal(formData);
    });

    it('should handle null values in toxic exposure data', () => {
      const formData = {
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: null,
          herbicide: { vietnam: true },
          additionalExposures: null,
        },
      };

      const expectedResult = {
        toxicExposure: {
          conditions: { none: true },
        },
      };

      const result = addToxicExposure(formData);

      expect(result).to.deep.equal(expectedResult);
    });

    it('should handle when conditions has "none" set to false', () => {
      const formData = {
        toxicExposure: {
          conditions: {
            none: false,
            chronicbronchitis: true,
          },
          gulfWar1990: { bahrain: true },
        },
      };

      const result = addToxicExposure(formData);

      // Should not clean data when "none" is false
      expect(result).to.deep.equal(formData);
    });

    it('should handle deeply nested toxic exposure data', () => {
      const formData = {
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: { bahrain: true },
          gulfWar1990Details: {
            bahrain: {
              startDate: '1991-01-01',
              endDate: '1991-12-31',
              additionalNotes: 'Some notes',
              nestedObject: {
                deepValue: 'should be removed',
              },
            },
          },
          herbicideDetails: {
            vietnam: {
              exposureInfo: {
                duration: '2 years',
                frequency: 'daily',
              },
            },
          },
        },
      };

      const expectedResult = {
        toxicExposure: {
          conditions: { none: true },
        },
      };

      const result = addToxicExposure(formData);

      expect(result).to.deep.equal(expectedResult);
    });
  });
});
