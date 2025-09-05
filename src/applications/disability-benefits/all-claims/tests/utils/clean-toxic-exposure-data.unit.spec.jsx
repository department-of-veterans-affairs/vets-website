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
          otherExposures: { asbestos: true },
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
            burnpits: true,
          },
          otherExposuresDetails: {
            asbestos: {
              startDate: '1980-01-01',
              endDate: '1985-01-01',
            },
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

      // Verify that all toxic exposure keys except 'conditions' were removed
      const remainingKeys = Object.keys(result.toxicExposure);
      expect(remainingKeys).to.deep.equal(['conditions']);

      // Verify only 'none' condition remains
      expect(result.toxicExposure.conditions).to.deep.equal({ none: true });
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

    it('should remove otherExposuresDetails for unselected exposures', () => {
      const formData = {
        toxicExposure: {
          conditions: { cancer: true },
          otherExposures: {
            burnpits: false,
            chemicals: true,
          },
          otherExposuresDetails: {
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

      expect(result.toxicExposure.otherExposuresDetails).to.not.have.property(
        'burnpits',
      );
      expect(result.toxicExposure.otherExposuresDetails).to.have.property(
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

  describe('edge cases for keeping false values in main exposure objects', () => {
    it('should keep false values in gulfWar1990 object while removing their details', () => {
      const formData = {
        toxicExposure: {
          conditions: { asthma: true },
          gulfWar1990: {
            afghanistan: true,
            bahrain: false,
            iraq: false,
            kuwait: true,
            oman: false,
            waters: true,
          },
          gulfWar1990Details: {
            afghanistan: { startDate: '2001-10-01', endDate: '2003-05-15' },
            bahrain: { startDate: '1990-08-15', endDate: '1991-06-30' },
            iraq: { startDate: '1991-01-17', endDate: '1991-02-28' },
            kuwait: { startDate: '1991-01-20', endDate: '1991-03-15' },
            oman: { startDate: '1991-01-01', endDate: '1991-12-31' },
            waters: { startDate: '1990-09-01', endDate: '1991-04-30' },
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      // Should keep all values in main object including false ones
      expect(result.toxicExposure.gulfWar1990).to.deep.equal({
        afghanistan: true,
        bahrain: false,
        iraq: false,
        kuwait: true,
        oman: false,
        waters: true,
      });

      // Should only keep details for true selections
      expect(result.toxicExposure.gulfWar1990Details).to.have.property(
        'afghanistan',
      );
      expect(result.toxicExposure.gulfWar1990Details).to.have.property(
        'kuwait',
      );
      expect(result.toxicExposure.gulfWar1990Details).to.have.property(
        'waters',
      );
      expect(result.toxicExposure.gulfWar1990Details).to.not.have.property(
        'bahrain',
      );
      expect(result.toxicExposure.gulfWar1990Details).to.not.have.property(
        'iraq',
      );
      expect(result.toxicExposure.gulfWar1990Details).to.not.have.property(
        'oman',
      );
    });

    it('should keep false values in herbicide object while removing their details', () => {
      const formData = {
        toxicExposure: {
          conditions: { cancer: true },
          herbicide: {
            cambodia: true,
            guam: false,
            johnston: true,
            koreandemilitarizedzone: false,
            laos: true,
            c123: false,
            thailand: true,
            vietnam: true,
            none: false,
          },
          herbicideDetails: {
            cambodia: { startDate: '1969-05-01', endDate: '1970-06-30' },
            guam: { startDate: '1968-01-15', endDate: '1969-12-31' },
            johnston: { startDate: '1972-04-01', endDate: '1973-09-30' },
            koreandemilitarizedzone: {
              startDate: '1968-04-01',
              endDate: '1969-10-31',
            },
            laos: { startDate: '1965-12-01', endDate: '1971-03-31' },
            c123: { startDate: '1970-01-01', endDate: '1971-01-01' },
            thailand: { startDate: '1967-02-01', endDate: '1975-05-31' },
            vietnam: { startDate: '1965-01-09', endDate: '1975-04-30' },
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      // Should keep all false values in main object
      expect(result.toxicExposure.herbicide.guam).to.equal(false);
      expect(result.toxicExposure.herbicide.koreandemilitarizedzone).to.equal(
        false,
      );
      expect(result.toxicExposure.herbicide.c123).to.equal(false);
      expect(result.toxicExposure.herbicide.none).to.equal(false);

      // Should only have details for true selections
      const detailKeys = Object.keys(result.toxicExposure.herbicideDetails);
      expect(detailKeys).to.have.members([
        'cambodia',
        'johnston',
        'laos',
        'thailand',
        'vietnam',
      ]);
      expect(detailKeys).to.not.include('guam');
      expect(detailKeys).to.not.include('koreandemilitarizedzone');
      expect(detailKeys).to.not.include('c123');
    });

    it('should keep false values in otherExposures object while removing their details', () => {
      const formData = {
        toxicExposure: {
          conditions: { asthma: true },
          otherExposures: {
            asbestos: true,
            chemical: true,
            chromium: false,
            depleted: false,
            water: true,
            mos: false,
            mustardgas: true,
            radiation: true,
            shad: false,
            shipyard: false,
            other: true,
          },
          otherExposuresDetails: {
            asbestos: { startDate: '1985-03-12', endDate: '1990-08-28' },
            chemical: { startDate: '1998-06-15', endDate: '2000-09-30' },
            chromium: { startDate: '2001-01-01', endDate: '2002-12-31' },
            depleted: { startDate: '2003-01-01', endDate: '2004-01-01' },
            water: { startDate: '1982-01-01', endDate: '1987-12-31' },
            mos: { startDate: '2005-03-10', endDate: '2010-08-20' },
            mustardgas: { startDate: '1991-02-01', endDate: '1991-04-15' },
            radiation: { startDate: '1999-07-01', endDate: '2003-01-31' },
            shad: { startDate: '1995-01-01', endDate: '1996-01-01' },
            shipyard: { startDate: '1997-01-01', endDate: '1998-01-01' },
            other: { startDate: '2010-01-01', endDate: '2015-12-31' },
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      // Should keep all values including false ones
      expect(result.toxicExposure.otherExposures).to.include({
        chromium: false,
        depleted: false,
        mos: false,
        shad: false,
        shipyard: false,
      });

      // Should only have details for true selections
      expect(result.toxicExposure.otherExposuresDetails).to.have.property(
        'asbestos',
      );
      expect(result.toxicExposure.otherExposuresDetails).to.have.property(
        'chemical',
      );
      expect(result.toxicExposure.otherExposuresDetails).to.have.property(
        'water',
      );
      expect(result.toxicExposure.otherExposuresDetails).to.have.property(
        'mustardgas',
      );
      expect(result.toxicExposure.otherExposuresDetails).to.have.property(
        'radiation',
      );
      expect(result.toxicExposure.otherExposuresDetails).to.have.property(
        'other',
      );

      // Should not have details for false selections
      expect(result.toxicExposure.otherExposuresDetails).to.not.have.property(
        'chromium',
      );
      expect(result.toxicExposure.otherExposuresDetails).to.not.have.property(
        'depleted',
      );
      expect(result.toxicExposure.otherExposuresDetails).to.not.have.property(
        'mos',
      );
      expect(result.toxicExposure.otherExposuresDetails).to.not.have.property(
        'shad',
      );
      expect(result.toxicExposure.otherExposuresDetails).to.not.have.property(
        'shipyard',
      );
    });
  });

  describe('comprehensive edge cases for all toxic exposure keys', () => {
    it('should remove all details when main selection is missing', () => {
      const formData = {
        toxicExposure: {
          conditions: { asthma: true },
          // Missing gulfWar1990 but has details
          gulfWar1990Details: {
            bahrain: { startDate: '1990-01-01', endDate: '1990-12-31' },
          },
          // Missing herbicide but has details
          herbicideDetails: {
            vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      expect(result.toxicExposure).to.not.have.property('gulfWar1990Details');
      expect(result.toxicExposure).to.not.have.property('herbicideDetails');
    });

    it('should handle all toxic exposure keys from getAllToxicExposureKeys', () => {
      const formData = {
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: { bahrain: true },
          gulfWar1990Details: { bahrain: { startDate: '1990-01-01' } },
          gulfWar2001: { afghanistan: true },
          gulfWar2001Details: { afghanistan: { startDate: '2001-01-01' } },
          herbicide: { vietnam: true },
          herbicideDetails: { vietnam: { startDate: '1968-01-01' } },
          otherHerbicideLocations: { description: 'Thailand' },
          otherExposures: { burnpits: true, asbestos: true },
          otherExposuresDetails: {
            burnpits: { startDate: '2003-01-01' },
            asbestos: { startDate: '1980-01-01' },
          },
          specifyOtherExposures: 'Lead paint',
        },
      };

      const result = cleanToxicExposureData(formData);

      // When 'none' is selected, only conditions should remain
      expect(result.toxicExposure).to.deep.equal({
        conditions: { none: true },
      });
      expect(Object.keys(result.toxicExposure)).to.have.lengthOf(1);
    });

    it('should handle mixed selection states with details', () => {
      const formData = {
        toxicExposure: {
          conditions: { cancer: true },
          gulfWar1990: {
            bahrain: true,
            iraq: false,
            kuwait: true,
            saudi: false,
          },
          gulfWar1990Details: {
            bahrain: { startDate: '1990-01-01', endDate: '1990-12-31' },
            iraq: { startDate: '1991-01-01', endDate: '1991-03-01' },
            kuwait: { startDate: '1991-02-01', endDate: '1991-04-01' },
            saudi: { startDate: '1991-01-01', endDate: '1991-06-01' },
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      // Should only keep details for selected locations
      expect(result.toxicExposure.gulfWar1990Details).to.have.property(
        'bahrain',
      );
      expect(result.toxicExposure.gulfWar1990Details).to.have.property(
        'kuwait',
      );
      expect(result.toxicExposure.gulfWar1990Details).to.not.have.property(
        'iraq',
      );
      expect(result.toxicExposure.gulfWar1990Details).to.not.have.property(
        'saudi',
      );
    });

    it('should completely remove toxicExposure when all data is empty', () => {
      const formData = {
        veteranInformation: { name: 'John Doe' },
        toxicExposure: {
          conditions: {},
          gulfWar1990: {},
          herbicide: null,
          additionalExposures: undefined,
        },
      };

      const result = cleanToxicExposureData(formData);

      expect(result).to.not.have.property('toxicExposure');
      expect(result.veteranInformation).to.deep.equal(
        formData.veteranInformation,
      );
    });

    it('should handle string and object formats for otherHerbicideLocations', () => {
      // Test with string format (if supported)
      const formDataString = {
        toxicExposure: {
          conditions: { asthma: true },
          otherHerbicideLocations: 'Thailand base camps',
        },
      };

      const resultString = cleanToxicExposureData(formDataString);
      expect(resultString.toxicExposure.otherHerbicideLocations).to.equal(
        'Thailand base camps',
      );

      // Test with empty string
      const formDataEmptyString = {
        toxicExposure: {
          conditions: { asthma: true },
          otherHerbicideLocations: '   ',
        },
      };

      const resultEmptyString = cleanToxicExposureData(formDataEmptyString);
      expect(resultEmptyString.toxicExposure).to.not.have.property(
        'otherHerbicideLocations',
      );
    });

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

    it('should handle real-world user scenarios', () => {
      // Scenario 1: User starts filling out toxic exposure, then selects "none"
      const scenario1 = {
        toxicExposure: {
          conditions: { none: true, asthma: false, cancer: false },
          gulfWar1990: { bahrain: true, iraq: true },
          gulfWar1990Details: {
            bahrain: { startDate: '1990-08-01', endDate: '1991-04-01' },
            iraq: { startDate: '1991-01-01', endDate: '1991-03-01' },
          },
          herbicide: { vietnam: true },
          herbicideDetails: {
            vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
          },
          otherHerbicideLocations: { description: 'Thailand perimeter' },
          otherExposures: { asbestos: true, radiation: true, burnpits: true },
          otherExposuresDetails: {
            asbestos: { startDate: '1980-01-01', endDate: '1985-01-01' },
            radiation: { startDate: '1990-01-01', endDate: '1991-01-01' },
            burnpits: { startDate: '2003-01-01', endDate: '2004-01-01' },
          },
          specifyOtherExposures: { description: 'Chemical weapons testing' },
        },
      };

      const result1 = cleanToxicExposureData(scenario1);
      expect(result1.toxicExposure).to.deep.equal({
        conditions: { none: true },
      });

      // Scenario 2: User partially fills out exposures
      const scenario2 = {
        toxicExposure: {
          conditions: { asthma: true, bronchitis: true },
          gulfWar1990: { bahrain: true, iraq: false },
          gulfWar1990Details: {
            bahrain: { startDate: '1990-08-01', endDate: '1991-04-01' },
            iraq: { startDate: '1991-01-01', endDate: '1991-03-01' }, // Should be removed
          },
          otherHerbicideLocations: { description: '' }, // Should be removed
          specifyOtherExposures: '   ', // Should be removed
        },
      };

      const result2 = cleanToxicExposureData(scenario2);
      expect(result2.toxicExposure.gulfWar1990Details).to.have.property(
        'bahrain',
      );
      expect(result2.toxicExposure.gulfWar1990Details).to.not.have.property(
        'iraq',
      );
      expect(result2.toxicExposure).to.not.have.property(
        'otherHerbicideLocations',
      );
      expect(result2.toxicExposure).to.not.have.property(
        'specifyOtherExposures',
      );

      // Scenario 3: User deselects all conditions but keeps exposure data
      const scenario3 = {
        toxicExposure: {
          conditions: {}, // Empty conditions
          gulfWar1990: { bahrain: true },
          gulfWar1990Details: {
            bahrain: { startDate: '1990-08-01', endDate: '1991-04-01' },
          },
        },
      };

      const result3 = cleanToxicExposureData(scenario3);
      // Should keep the exposure data even with empty conditions
      expect(result3.toxicExposure.gulfWar1990).to.deep.equal({
        bahrain: true,
      });
      expect(result3.toxicExposure.gulfWar1990Details).to.have.property(
        'bahrain',
      );
    });

    it('should handle validation of all toxic exposure fields', () => {
      // This test ensures we handle all the keys from the mapping
      const allKeysData = {
        toxicExposure: {
          conditions: { asthma: true },
          gulfWar1990: { location1: true, location2: false },
          gulfWar1990Details: {
            location1: { data: 'keep' },
            location2: { data: 'remove' }, // Should be removed
          },
          gulfWar2001: { location3: false, location4: true },
          gulfWar2001Details: {
            location3: { data: 'remove' }, // Should be removed
            location4: { data: 'keep' },
          },
          herbicide: { location5: true, location6: false },
          herbicideDetails: {
            location5: { data: 'keep' },
            location6: { data: 'remove' }, // Should be removed
          },
          otherHerbicideLocations: { description: 'Valid description' },
          otherExposures: { exposure3: false, exposure4: true },
          otherExposuresDetails: {
            exposure3: { data: 'remove' }, // Should be removed
            exposure4: { data: 'keep' },
          },
          specifyOtherExposures: 'Valid other exposure description',
        },
      };

      const result = cleanToxicExposureData(allKeysData);

      // Verify correct details are kept/removed
      expect(result.toxicExposure.gulfWar1990Details).to.have.property(
        'location1',
      );
      expect(result.toxicExposure.gulfWar1990Details).to.not.have.property(
        'location2',
      );
      expect(result.toxicExposure.gulfWar2001Details).to.have.property(
        'location4',
      );
      expect(result.toxicExposure.gulfWar2001Details).to.not.have.property(
        'location3',
      );
      expect(result.toxicExposure.herbicideDetails).to.have.property(
        'location5',
      );
      expect(result.toxicExposure.herbicideDetails).to.not.have.property(
        'location6',
      );
      expect(result.toxicExposure.otherExposuresDetails).to.have.property(
        'exposure4',
      );
      expect(result.toxicExposure.otherExposuresDetails).to.not.have.property(
        'exposure3',
      );

      // Verify string fields are kept
      expect(result.toxicExposure.otherHerbicideLocations).to.deep.equal({
        description: 'Valid description',
      });
      expect(result.toxicExposure.specifyOtherExposures).to.equal(
        'Valid other exposure description',
      );
    });
  });

  describe('edge cases with false values', () => {
    it('should remove details for all false selections across all exposure types', () => {
      const formData = {
        toxicExposure: {
          conditions: {
            asthma: true,
            chronicbronchitis: true,
          },
          gulfWar1990: {
            afghanistan: true,
            bahrain: true,
            iraq: false,
            kuwait: true,
            oman: false,
            qatar: false,
            saudiarabia: true,
            somalia: false,
            turkey: false,
            unitedarabemirates: false,
            waters: true,
            airspace: true,
          },
          gulfWar1990Details: {
            // Should keep these (true values)
            afghanistan: { startDate: '2001-10-01', endDate: '2003-05-15' },
            bahrain: { startDate: '1990-08-15', endDate: '1991-06-30' },
            kuwait: { startDate: '1991-01-20', endDate: '1991-03-15' },
            saudiarabia: { startDate: '1990-08-02', endDate: '1991-07-31' },
            waters: { startDate: '1990-09-01', endDate: '1991-04-30' },
            airspace: { startDate: '1990-08-10', endDate: '1991-05-15' },
            // Should remove these (false values)
            iraq: { startDate: '1991-01-01', endDate: '1991-03-31' },
            oman: { startDate: '1990-09-01', endDate: '1991-02-28' },
            qatar: { startDate: '1990-10-01', endDate: '1991-01-31' },
            somalia: { startDate: '1992-01-01', endDate: '1993-03-31' },
            turkey: { startDate: '1991-01-17', endDate: '1991-02-28' },
            unitedarabemirates: {
              startDate: '1990-09-15',
              endDate: '1991-04-15',
            },
          },
          gulfWar2001: {
            afghanistan: true,
            bahrain: false,
            djibouti: true,
            egypt: false,
            jordan: false,
            lebanon: true,
            oman: false,
            pakistan: false,
            philippines: false,
            qatar: false,
            saudiarabia: false,
            somalia: true,
            syria: false,
            unitedarabemirates: false,
            uzbekistan: true,
            yemen: true,
            airspace: true,
          },
          gulfWar2001Details: {
            // Should keep these (true values)
            afghanistan: { startDate: '2001-10-07', endDate: '2021-08-31' },
            djibouti: { startDate: '2002-10-01', endDate: '2005-03-31' },
            lebanon: { startDate: '2006-07-12', endDate: '2006-08-14' },
            somalia: { startDate: '2007-01-01', endDate: '2009-12-31' },
            uzbekistan: { startDate: '2001-10-15', endDate: '2003-05-20' },
            yemen: { startDate: '2009-12-01', endDate: '2011-06-30' },
            airspace: { startDate: '2020-01-30', endDate: '2023-06-21' },
            // Should remove these (false values)
            bahrain: { startDate: '2001-09-01', endDate: '2003-12-31' },
            egypt: { startDate: '2011-01-01', endDate: '2011-12-31' },
            jordan: { startDate: '2003-03-01', endDate: '2003-09-30' },
            oman: { startDate: '2001-10-01', endDate: '2002-06-30' },
            pakistan: { startDate: '2001-12-01', endDate: '2002-03-31' },
            philippines: { startDate: '2002-01-01', endDate: '2002-07-31' },
            qatar: { startDate: '2002-03-01', endDate: '2003-01-31' },
            saudiarabia: { startDate: '2001-09-01', endDate: '2003-04-30' },
            syria: { startDate: '2014-09-01', endDate: '2019-10-31' },
            unitedarabemirates: {
              startDate: '2001-10-01',
              endDate: '2002-12-31',
            },
          },
          herbicide: {
            cambodia: true,
            guam: false,
            johnston: true,
            koreandemilitarizedzone: false,
            laos: true,
            c123: false,
            thailand: true,
            vietnam: true,
            none: false,
          },
          herbicideDetails: {
            // Should keep these (true values)
            cambodia: { startDate: '1969-05-01', endDate: '1970-06-30' },
            johnston: { startDate: '1972-04-01', endDate: '1973-09-30' },
            laos: { startDate: '1965-12-01', endDate: '1971-03-31' },
            thailand: { startDate: '1967-02-01', endDate: '1975-05-31' },
            vietnam: { startDate: '1965-01-09', endDate: '1975-04-30' },
            // Should remove these (false values)
            guam: { startDate: '1968-01-01', endDate: '1970-12-31' },
            koreandemilitarizedzone: {
              startDate: '1968-04-01',
              endDate: '1969-07-31',
            },
            c123: { startDate: '1972-01-01', endDate: '1982-12-31' },
          },
          otherExposures: {
            asbestos: true,
            chemical: true,
            chromium: false,
            depleted: false,
            water: true,
            mos: false,
            mustardgas: true,
            radiation: true,
            shad: false,
            shipyard: false,
            other: true,
          },
          otherExposuresDetails: {
            // Should keep these (true values)
            asbestos: { startDate: '1985-03-12', endDate: '1990-08-28' },
            chemical: { startDate: '1998-06-15', endDate: '2000-09-30' },
            water: { startDate: '1982-01-01', endDate: '1987-12-31' },
            mustardgas: { startDate: '1991-02-01', endDate: '1991-04-15' },
            radiation: { startDate: '1999-07-01', endDate: '2003-01-31' },
            other: { startDate: '2010-01-01', endDate: '2015-12-31' },
            // Should remove these (false values)
            chromium: { startDate: '1990-01-01', endDate: '1995-12-31' },
            depleted: { startDate: '1991-01-01', endDate: '1991-04-30' },
            mos: { startDate: '1985-01-01', endDate: '1988-12-31' },
            shad: { startDate: '1962-01-01', endDate: '1973-12-31' },
            shipyard: { startDate: '1980-01-01', endDate: '1985-12-31' },
          },
          otherHerbicideLocations: {
            description: 'Agent Orange testing facility in Nevada desert',
          },
          specifyOtherExposures: {
            description: 'Exposed to experimental chemical agents',
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      // Verify conditions are kept
      expect(result.toxicExposure.conditions).to.deep.equal({
        asthma: true,
        chronicbronchitis: true,
      });

      // Verify Gulf War 1990 - false values kept but their details removed
      expect(result.toxicExposure.gulfWar1990).to.include({
        iraq: false,
        oman: false,
        qatar: false,
        somalia: false,
        turkey: false,
        unitedarabemirates: false,
      });
      expect(result.toxicExposure.gulfWar1990Details).to.not.have.any.keys(
        'iraq',
        'oman',
        'qatar',
        'somalia',
        'turkey',
        'unitedarabemirates',
      );
      expect(result.toxicExposure.gulfWar1990Details).to.have.all.keys(
        'afghanistan',
        'bahrain',
        'kuwait',
        'saudiarabia',
        'waters',
        'airspace',
      );

      // Verify Gulf War 2001 - false values kept but their details removed
      expect(result.toxicExposure.gulfWar2001).to.include({
        bahrain: false,
        egypt: false,
        jordan: false,
        oman: false,
        pakistan: false,
        philippines: false,
        qatar: false,
        saudiarabia: false,
        syria: false,
        unitedarabemirates: false,
      });
      expect(result.toxicExposure.gulfWar2001Details).to.not.have.any.keys(
        'bahrain',
        'egypt',
        'jordan',
        'oman',
        'pakistan',
        'philippines',
        'qatar',
        'saudiarabia',
        'syria',
        'unitedarabemirates',
      );
      expect(result.toxicExposure.gulfWar2001Details).to.have.all.keys(
        'afghanistan',
        'djibouti',
        'lebanon',
        'somalia',
        'uzbekistan',
        'yemen',
        'airspace',
      );

      // Verify Herbicide - false values kept but their details removed
      expect(result.toxicExposure.herbicide).to.include({
        guam: false,
        koreandemilitarizedzone: false,
        c123: false,
        none: false,
      });
      expect(result.toxicExposure.herbicideDetails).to.not.have.any.keys(
        'guam',
        'koreandemilitarizedzone',
        'c123',
      );
      expect(result.toxicExposure.herbicideDetails).to.have.all.keys(
        'cambodia',
        'johnston',
        'laos',
        'thailand',
        'vietnam',
      );

      // Verify Other Exposures - false values kept but their details removed
      expect(result.toxicExposure.otherExposures).to.include({
        chromium: false,
        depleted: false,
        mos: false,
        shad: false,
        shipyard: false,
      });
      expect(result.toxicExposure.otherExposuresDetails).to.not.have.any.keys(
        'chromium',
        'depleted',
        'mos',
        'shad',
        'shipyard',
      );
      expect(result.toxicExposure.otherExposuresDetails).to.have.all.keys(
        'asbestos',
        'chemical',
        'water',
        'mustardgas',
        'radiation',
        'other',
      );

      // Verify description fields are kept
      expect(result.toxicExposure.otherHerbicideLocations).to.deep.equal({
        description: 'Agent Orange testing facility in Nevada desert',
      });
      expect(result.toxicExposure.specifyOtherExposures).to.deep.equal({
        description: 'Exposed to experimental chemical agents',
      });
    });

    it('should handle mixed undefined and false values correctly', () => {
      const formData = {
        toxicExposure: {
          conditions: { asthma: true },
          gulfWar1990: {
            afghanistan: true,
            bahrain: false,
            // iraq is undefined (not included)
            kuwait: undefined,
            oman: null,
          },
          gulfWar1990Details: {
            afghanistan: { startDate: '2001-10-01' },
            bahrain: { startDate: '1990-08-15' },
            iraq: { startDate: '1991-01-01' },
            kuwait: { startDate: '1991-01-20' },
            oman: { startDate: '1990-09-01' },
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      // Only afghanistan should have details (true value)
      expect(result.toxicExposure.gulfWar1990Details).to.deep.equal({
        afghanistan: { startDate: '2001-10-01' },
      });

      // False value should be kept in main object
      expect(result.toxicExposure.gulfWar1990.bahrain).to.equal(false);

      // Details for false, undefined, and null values should be removed
      expect(result.toxicExposure.gulfWar1990Details.bahrain).to.be.undefined;
      expect(result.toxicExposure.gulfWar1990Details.iraq).to.be.undefined;
      expect(result.toxicExposure.gulfWar1990Details.kuwait).to.be.undefined;
      expect(result.toxicExposure.gulfWar1990Details.oman).to.be.undefined;
    });

    it('should handle case where all selections are false', () => {
      const formData = {
        toxicExposure: {
          conditions: { asthma: true },
          gulfWar1990: {
            afghanistan: false,
            bahrain: false,
            iraq: false,
          },
          gulfWar1990Details: {
            afghanistan: { startDate: '2001-10-01' },
            bahrain: { startDate: '1990-08-15' },
            iraq: { startDate: '1991-01-01' },
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      // All false values should be removed along with the entire section
      expect(result.toxicExposure.gulfWar1990).to.be.undefined;
      expect(result.toxicExposure.gulfWar1990Details).to.be.undefined;

      // Only conditions should remain
      expect(result.toxicExposure).to.deep.equal({
        conditions: { asthma: true },
      });
    });

    it('should properly clean a real-world payload with mixed true/false values', () => {
      // Using a subset of the actual payload provided
      const formData = {
        toxicExposure: {
          conditions: {
            asthma: true,
            chronicbronchitis: true,
          },
          herbicide: {
            cambodia: true,
            guam: false, // This is false
            johnston: true,
            koreandemilitarizedzone: false, // This is false
            laos: true,
            c123: false, // This is false
            thailand: true,
            vietnam: true,
            none: false, // This is false
          },
          herbicideDetails: {
            cambodia: { startDate: '1969-05-01', endDate: '1970-06-30' },
            guam: { startDate: '1968-01-01', endDate: '1970-12-31' }, // Should be removed
            johnston: { startDate: '1972-04-01', endDate: '1973-09-30' },
            koreandemilitarizedzone: {
              startDate: '1968-04-01',
              endDate: '1969-07-31',
            }, // Should be removed
            laos: { startDate: '1965-12-01', endDate: '1971-03-31' },
            c123: { startDate: '1972-01-01', endDate: '1982-12-31' }, // Should be removed
            thailand: { startDate: '1967-02-01', endDate: '1975-05-31' },
            vietnam: { startDate: '1965-01-09', endDate: '1975-04-30' },
          },
        },
      };

      const result = cleanToxicExposureData(formData);

      // Verify false values are kept in main object
      expect(result.toxicExposure.herbicide).to.deep.equal({
        cambodia: true,
        guam: false,
        johnston: true,
        koreandemilitarizedzone: false,
        laos: true,
        c123: false,
        thailand: true,
        vietnam: true,
        none: false,
      });

      // Verify details for false values are removed
      expect(result.toxicExposure.herbicideDetails).to.deep.equal({
        cambodia: { startDate: '1969-05-01', endDate: '1970-06-30' },
        johnston: { startDate: '1972-04-01', endDate: '1973-09-30' },
        laos: { startDate: '1965-12-01', endDate: '1971-03-31' },
        thailand: { startDate: '1967-02-01', endDate: '1975-05-31' },
        vietnam: { startDate: '1965-01-09', endDate: '1975-04-30' },
      });

      // Explicitly verify removed entries
      expect(result.toxicExposure.herbicideDetails.guam).to.be.undefined;
      expect(result.toxicExposure.herbicideDetails.koreandemilitarizedzone).to
        .be.undefined;
      expect(result.toxicExposure.herbicideDetails.c123).to.be.undefined;
    });
  });
});
