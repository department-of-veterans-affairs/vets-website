import { expect } from 'chai';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import { cleanToxicExposureData } from '../../utils/submit';

describe('cleanToxicExposureData', () => {
  describe('when user has no toxic exposure data', () => {
    it('should return the form data unchanged', () => {
      const formData = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        veteranInformation: { name: 'John Doe' },
      };

      const result = cleanToxicExposureData(formData);

      expect(result).to.deep.equal(formData);
    });
  });

  describe('when user has toxic exposure data but no toxic exposure conditions', () => {
    it('should return the form data unchanged', () => {
      const formData = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          gulfWar1990: { bahrain: true },
          herbicide: { vietnam: true },
        },
      };

      const result = cleanToxicExposureData(formData);

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

      const result = cleanToxicExposureData(formData);

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
          otherHerbicideLocations: {
            description: 'Other herbicide location',
          },
          otherExposures: {
            asbestos: true,
            radiation: true,
          },
          otherExposuresDetails: {
            asbestos: {
              startDate: '1980-01-01',
              endDate: '1985-01-01',
            },
          },
          additionalExposures: {
            burnpits: true,
          },
          additionalExposuresDetails: {
            burnpits: {
              startDate: '2003-01-01',
              endDate: '2004-01-01',
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

      const result = cleanToxicExposureData(formData);

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

      const result = cleanToxicExposureData(formData);

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

      cleanToxicExposureData(originalFormData);

      // Original data should remain unchanged
      expect(originalFormData).to.deep.equal(formDataCopy);
    });
  });

  describe('when cleaning individual exposure details', () => {
    it('should remove Gulf War 1990 details for unselected locations', () => {
      const formData = {
        toxicExposure: {
          conditions: { asthma: true },
          gulfWar1990: {
            bahrain: false,
            iraq: true,
          },
          gulfWar1990Details: {
            bahrain: {
              startDate: '1990-01-01',
              endDate: '1990-12-31',
            },
            iraq: {
              startDate: '1991-01-01',
              endDate: '1991-12-31',
            },
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      expect(result.toxicExposure.gulfWar1990Details).to.not.have.property(
        'bahrain',
      );
      expect(result.toxicExposure.gulfWar1990Details).to.have.property('iraq');
    });

    it('should remove Gulf War 2001 details for unselected locations', () => {
      const formData = {
        toxicExposure: {
          conditions: { cancer: true },
          gulfWar2001: {
            afghanistan: true,
            yemen: false,
          },
          gulfWar2001Details: {
            afghanistan: {
              startDate: '2001-10-01',
              endDate: '2002-10-01',
            },
            yemen: {
              startDate: '2002-01-01',
              endDate: '2003-01-01',
            },
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      expect(result.toxicExposure.gulfWar2001Details).to.have.property(
        'afghanistan',
      );
      expect(result.toxicExposure.gulfWar2001Details).to.not.have.property(
        'yemen',
      );
    });

    it('should remove herbicide details for unselected locations', () => {
      const formData = {
        toxicExposure: {
          conditions: { bronchitis: true },
          herbicide: {
            vietnam: true,
            cambodia: false,
          },
          herbicideDetails: {
            vietnam: {
              startDate: '1968-01-01',
              endDate: '1970-01-01',
            },
            cambodia: {
              startDate: '1969-01-01',
              endDate: '1970-01-01',
            },
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      expect(result.toxicExposure.herbicideDetails).to.have.property('vietnam');
      expect(result.toxicExposure.herbicideDetails).to.not.have.property(
        'cambodia',
      );
    });

    it('should remove otherHerbicideLocations when description is empty', () => {
      const formData = {
        toxicExposure: {
          conditions: { asthma: true },
          otherHerbicideLocations: {
            description: '   ',
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      expect(result.toxicExposure).to.not.have.property(
        'otherHerbicideLocations',
      );
    });

    it('should keep otherHerbicideLocations when description has content', () => {
      const formData = {
        toxicExposure: {
          conditions: { asthma: true },
          otherHerbicideLocations: {
            description: 'Thailand base camps',
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      expect(result.toxicExposure.otherHerbicideLocations).to.deep.equal({
        description: 'Thailand base camps',
      });
    });

    it('should remove view:* fields', () => {
      const formData = {
        toxicExposure: {
          conditions: { asthma: true },
          'view:herbicideAdditionalInfo': 'some info',
          'view:otherExposuresAdditionalInfo': 'other info',
          'view:additionalExposuresAdditionalInfo': 'additional info',
          herbicide: { vietnam: true },
        },
      };

      const result = cleanToxicExposureData(formData);

      expect(result.toxicExposure).to.not.have.property(
        'view:herbicideAdditionalInfo',
      );
      expect(result.toxicExposure).to.not.have.property(
        'view:otherExposuresAdditionalInfo',
      );
      expect(result.toxicExposure).to.not.have.property(
        'view:additionalExposuresAdditionalInfo',
      );
      expect(result.toxicExposure.herbicide).to.deep.equal({ vietnam: true });
    });

    it('should remove otherExposuresDetails for unselected exposures', () => {
      const formData = {
        toxicExposure: {
          conditions: { asthma: true },
          otherExposures: {
            asbestos: true,
            radiation: false,
          },
          otherExposuresDetails: {
            asbestos: {
              startDate: '1980-01-01',
              endDate: '1985-01-01',
            },
            radiation: {
              startDate: '1990-01-01',
              endDate: '1991-01-01',
            },
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      expect(result.toxicExposure.otherExposuresDetails).to.have.property(
        'asbestos',
      );
      expect(result.toxicExposure.otherExposuresDetails).to.not.have.property(
        'radiation',
      );
    });

    it('should remove additionalExposuresDetails for unselected exposures', () => {
      const formData = {
        toxicExposure: {
          conditions: { cancer: true },
          additionalExposures: {
            burnpits: false,
            chemicals: true,
          },
          additionalExposuresDetails: {
            burnpits: {
              startDate: '2003-01-01',
              endDate: '2004-01-01',
            },
            chemicals: {
              startDate: '2005-01-01',
              endDate: '2006-01-01',
            },
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      expect(
        result.toxicExposure.additionalExposuresDetails,
      ).to.not.have.property('burnpits');
      expect(result.toxicExposure.additionalExposuresDetails).to.have.property(
        'chemicals',
      );
    });

    it('should remove specifyOtherExposures when empty string', () => {
      const formData = {
        toxicExposure: {
          conditions: { asthma: true },
          specifyOtherExposures: '   ',
        },
      };

      const result = cleanToxicExposureData(formData);

      expect(result.toxicExposure).to.not.have.property(
        'specifyOtherExposures',
      );
    });

    it('should keep specifyOtherExposures when string has content', () => {
      const formData = {
        toxicExposure: {
          conditions: { asthma: true },
          specifyOtherExposures: 'Mercury exposure',
        },
      };

      const result = cleanToxicExposureData(formData);

      expect(result.toxicExposure.specifyOtherExposures).to.equal(
        'Mercury exposure',
      );
    });

    it('should remove specifyOtherExposures when object description is empty', () => {
      const formData = {
        toxicExposure: {
          conditions: { asthma: true },
          specifyOtherExposures: {
            description: '   ',
            otherField: 'value',
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      expect(result.toxicExposure).to.not.have.property(
        'specifyOtherExposures',
      );
    });

    it('should keep specifyOtherExposures when object description has content', () => {
      const formData = {
        toxicExposure: {
          conditions: { asthma: true },
          specifyOtherExposures: {
            description: 'Lead paint exposure',
            otherField: 'value',
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      expect(result.toxicExposure.specifyOtherExposures).to.deep.equal({
        description: 'Lead paint exposure',
        otherField: 'value',
      });
    });

    it('should remove multiple false conditions', () => {
      const formData = {
        toxicExposure: {
          conditions: {
            asthma: true,
            bronchitis: false,
            cancer: true,
            copd: false,
            none: false,
          },
          gulfWar1990: { bahrain: true },
        },
      };

      const result = cleanToxicExposureData(formData);

      expect(result.toxicExposure.conditions).to.deep.equal({
        asthma: true,
        cancer: true,
      });
      expect(result.toxicExposure.conditions).to.not.have.property(
        'bronchitis',
      );
      expect(result.toxicExposure.conditions).to.not.have.property('copd');
      expect(result.toxicExposure.conditions).to.not.have.property('none');
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

      const result = cleanToxicExposureData(formData);

      expect(result).to.deep.equal(formData);
    });

    it('should handle undefined toxicExposure.conditions', () => {
      const formData = {
        toxicExposure: {
          gulfWar1990: { bahrain: true },
        },
      };

      const result = cleanToxicExposureData(formData);

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

      const result = cleanToxicExposureData(formData);

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

      const expectedResult = {
        toxicExposure: {
          conditions: {
            chronicbronchitis: true,
          },
          gulfWar1990: { bahrain: true },
        },
      };

      const result = cleanToxicExposureData(formData);

      // Should remove "none: false" but keep other data
      expect(result).to.deep.equal(expectedResult);
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

      const result = cleanToxicExposureData(formData);

      expect(result).to.deep.equal(expectedResult);
    });
  });
});
