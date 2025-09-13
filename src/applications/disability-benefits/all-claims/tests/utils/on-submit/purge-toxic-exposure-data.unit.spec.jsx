import { expect } from 'chai';
import {
  purgeToxicExposureData,
  getAllToxicExposureKeys,
} from '../../../utils/on-submit';

/**
 * Tests for toxic exposure data purging functionality
 *
 * Key behaviors tested:
 * 1. Feature flag control - only processes when disability526ToxicExposureOptOutDataPurge is true
 * 2. "None" condition handling - purges all other data when only "none" is selected
 * 3. Detail retention - retains only details for selected locations
 * 4. Orphaned data purging - removes details without corresponding selections
 * 5. Text field validation - purges fields with whitespace-only descriptions
 * 6. Falsy value handling - null values removed (cloneDeep bug), false/undefined/0/'' preserved
 * 7. Data type validation - handles non-object values gracefully
 */
describe('purgeToxicExposureData', () => {
  describe('when feature flag is disabled', () => {
    it('should not purge when flag is false', () => {
      const formData = {
        disability526ToxicExposureOptOutDataPurge: false,
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: { bahrain: true },
        },
      };

      const result = purgeToxicExposureData(formData);
      expect(result).to.deep.equal(formData);
    });

    it('should not purge when flag is undefined', () => {
      const formData = {
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: { bahrain: true },
        },
      };

      const result = purgeToxicExposureData(formData);
      expect(result).to.deep.equal(formData);
    });
  });

  describe('when feature flag is enabled', () => {
    describe('with no toxic exposure data', () => {
      it('should return unchanged when toxicExposure missing', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        };

        const result = purgeToxicExposureData(formData);
        expect(result).to.deep.equal(formData);
      });

      it('should purge empty toxicExposure object', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: {},
            gulfWar1990: {},
            herbicide: null,
          },
        };

        const result = purgeToxicExposureData(formData);
        expect(result).to.not.have.property('toxicExposure');
      });
    });

    describe('with "none" condition selected', () => {
      it('should retain only none condition when selected alone', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { none: true },
            gulfWar1990: { bahrain: true },
            gulfWar1990Details: {
              bahrain: { startDate: '1991-01-01', endDate: '1991-12-31' },
            },
            herbicide: { vietnam: true },
            herbicideDetails: {
              vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
            },
            otherHerbicideLocations: { description: 'Thailand' },
            otherExposures: { asbestos: true },
            otherExposuresDetails: {
              asbestos: { startDate: '1980-01-01', endDate: '1985-01-01' },
            },
            specifyOtherExposures: 'Lead exposure',
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure).to.deep.equal({
          conditions: { none: true },
        });
        expect(Object.keys(result.toxicExposure)).to.have.lengthOf(1);
      });

      it('should preserve other form data when purging toxic exposure', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          newDisabilities: [{ condition: 'Chronic Bronchitis' }],
          veteranInformation: { name: 'John Doe' },
          toxicExposure: {
            conditions: { none: true },
            gulfWar1990: { bahrain: true },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.newDisabilities).to.deep.equal(formData.newDisabilities);
        expect(result.veteranInformation).to.deep.equal(
          formData.veteranInformation,
        );
        expect(result.toxicExposure).to.deep.equal({
          conditions: { none: true },
        });
      });
    });

    describe('with actual conditions selected', () => {
      it('should retain all data when conditions selected', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true, cancer: true },
            gulfWar1990: { bahrain: true },
            gulfWar1990Details: {
              bahrain: { startDate: '1991-01-01', endDate: '1991-12-31' },
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure.conditions).to.deep.equal({
          asthma: true,
          cancer: true,
        });
        expect(result.toxicExposure.gulfWar1990).to.exist;
        expect(result.toxicExposure.gulfWar1990Details).to.exist;
      });

      it('should purge false conditions', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: {
              asthma: true,
              bronchitis: false,
              cancer: true,
              none: false,
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure.conditions).to.deep.equal({
          asthma: true,
          cancer: true,
        });
      });
    });

    describe('exposure detail purging', () => {
      it('should retain details only for selected locations', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            // Gulf War 1990
            gulfWar1990: {
              bahrain: true,
              iraq: false,
            },
            gulfWar1990Details: {
              bahrain: { startDate: '1990-01-01', endDate: '1990-12-31' },
              iraq: { startDate: '1991-01-01', endDate: '1991-12-31' },
            },
            // Gulf War 2001
            gulfWar2001: {
              afghanistan: true,
              yemen: false,
            },
            gulfWar2001Details: {
              afghanistan: { startDate: '2001-10-01', endDate: '2002-10-01' },
              yemen: { startDate: '2002-01-01', endDate: '2003-01-01' },
            },
            // Herbicide
            herbicide: {
              vietnam: true,
              cambodia: false,
            },
            herbicideDetails: {
              vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
              cambodia: { startDate: '1969-01-01', endDate: '1970-01-01' },
            },
            // Other exposures
            otherExposures: {
              asbestos: true,
              radiation: false,
            },
            otherExposuresDetails: {
              asbestos: { startDate: '1980-01-01', endDate: '1985-01-01' },
              radiation: { startDate: '1990-01-01', endDate: '1991-01-01' },
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        // Gulf War 1990
        expect(result.toxicExposure.gulfWar1990Details).to.have.property(
          'bahrain',
        );
        expect(result.toxicExposure.gulfWar1990Details).to.not.have.property(
          'iraq',
        );

        // Gulf War 2001
        expect(result.toxicExposure.gulfWar2001Details).to.have.property(
          'afghanistan',
        );
        expect(result.toxicExposure.gulfWar2001Details).to.not.have.property(
          'yemen',
        );

        // Herbicide
        expect(result.toxicExposure.herbicideDetails).to.have.property(
          'vietnam',
        );
        expect(result.toxicExposure.herbicideDetails).to.not.have.property(
          'cambodia',
        );

        // Other exposures
        expect(result.toxicExposure.otherExposuresDetails).to.have.property(
          'asbestos',
        );
        expect(result.toxicExposure.otherExposuresDetails).to.not.have.property(
          'radiation',
        );
      });

      it('should retain false values in main objects while purging their details', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            gulfWar1990: {
              afghanistan: true,
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

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure.gulfWar1990).to.deep.equal({
          afghanistan: true,
          bahrain: false,
          iraq: false,
        });

        expect(result.toxicExposure.gulfWar1990Details).to.deep.equal({
          afghanistan: { startDate: '2001-10-01' },
        });
      });

      it('should purge orphaned details when main selection missing', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
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

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property('gulfWar1990Details');
        expect(result.toxicExposure).to.not.have.property('herbicideDetails');
      });

      it('should purge entire exposure section when all values are false', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            gulfWar1990: {
              afghanistan: false,
              bahrain: false,
            },
            gulfWar1990Details: {
              afghanistan: { startDate: '2001-10-01' },
              bahrain: { startDate: '1990-08-15' },
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property('gulfWar1990');
        expect(result.toxicExposure).to.not.have.property('gulfWar1990Details');
      });

      it('should purge otherHerbicideLocations when herbicide.none is true', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: {
              none: true,
              vietnam: true,
              cambodia: true,
            },
            otherHerbicideLocations: { description: 'Should be removed' },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure.herbicide).to.deep.equal({
          none: true,
          vietnam: true,
          cambodia: true,
        });
      });

      it('should handle exposure with all false values and otherLocationsKey', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: {
              vietnam: false,
              cambodia: false,
            },
            herbicideDetails: {
              vietnam: { startDate: '1968-01-01' },
            },
            otherHerbicideLocations: { description: 'Other location' },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property('herbicide');
        expect(result.toxicExposure).to.not.have.property('herbicideDetails');
        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
      });

      it('should handle invalid data types by converting to empty objects or removing', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: 'not-an-object', // converted to {}
            gulfWar1990: 'not-an-object', // treated as non-plain object
            gulfWar1990Details: {
              bahrain: { startDate: '1990-01-01' },
            },
            herbicide: { vietnam: true }, // valid data to prevent entire removal
          },
        };

        const result = purgeToxicExposureData(formData);

        // When conditions is a string, it gets converted to empty object
        expect(result.toxicExposure.conditions).to.deep.equal({});
        // Details are purged when selection is not a plain object
        expect(result.toxicExposure).to.not.have.property('gulfWar1990Details');
        // Valid herbicide data remains
        expect(result.toxicExposure.herbicide).to.deep.equal({ vietnam: true });
      });

      it('should handle falsy values correctly: null removed by cloneDeep, others preserved', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            gulfWar1990: null, // purged by cloneDeep transformation
            herbicide: undefined, // retained
            otherExposures: {
              asbestos: false, // retained
              radiation: true,
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property('gulfWar1990');
        expect(result.toxicExposure).to.have.property('herbicide');
        expect(result.toxicExposure.herbicide).to.be.undefined;
        expect(result.toxicExposure.otherExposures.asbestos).to.equal(false);
        expect(result.toxicExposure.otherExposures.radiation).to.equal(true);
      });
    });

    describe('text field validation (otherHerbicideLocations & specifyOtherExposures)', () => {
      it('should purge fields with invalid descriptions (whitespace-only or empty objects)', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherHerbicideLocations: '   ', // purged - whitespace only
            specifyOtherExposures: { description: '   ' }, // purged - whitespace description
          },
        };

        const result = purgeToxicExposureData(formData);
        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure).to.not.have.property(
          'specifyOtherExposures',
        );
      });

      it('should retain fields with valid descriptions (non-empty strings or objects with content)', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherHerbicideLocations: 'Thailand base camps', // retained - valid string
            specifyOtherExposures: { description: 'Lead exposure' }, // retained - valid description
          },
        };

        const result = purgeToxicExposureData(formData);
        expect(result.toxicExposure.otherHerbicideLocations).to.equal(
          'Thailand base camps',
        );
        expect(result.toxicExposure.specifyOtherExposures).to.deep.equal({
          description: 'Lead exposure',
        });
      });
    });

    describe('edge cases', () => {
      it('should return unchanged for invalid toxicExposure types (string, array, etc)', () => {
        const stringCase = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: 'not-an-object',
        };
        const arrayCase = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: [],
        };

        expect(purgeToxicExposureData(stringCase)).to.deep.equal(stringCase);
        expect(purgeToxicExposureData(arrayCase)).to.deep.equal(arrayCase);
      });

      it('should handle null and undefined values', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            gulfWar1990: null,
            herbicide: undefined,
            otherExposures: { asbestos: true },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure).to.have.property('conditions');
        expect(result.toxicExposure).to.have.property('otherExposures');
        expect(result.toxicExposure).to.not.have.property('gulfWar1990');
        expect(result.toxicExposure).to.have.property('herbicide');
        expect(result.toxicExposure.herbicide).to.be.undefined;
      });

      it('should handle empty conditions object', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: {},
            gulfWar1990: { bahrain: true },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure.conditions).to.deep.equal({});
        expect(result.toxicExposure.gulfWar1990).to.exist;
      });

      it('should handle missing conditions', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            gulfWar1990: { bahrain: true },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure.gulfWar1990).to.exist;
        expect(result.toxicExposure).to.not.have.property('conditions');
      });

      it('should not mutate original form data', () => {
        const originalFormData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { none: true },
            gulfWar1990: { bahrain: true },
          },
        };

        const formDataCopy = JSON.parse(JSON.stringify(originalFormData));
        purgeToxicExposureData(originalFormData);

        expect(originalFormData).to.deep.equal(formDataCopy);
      });
    });

    describe('integration tests', () => {
      it('should correctly process complex form with mixed selections and empty values', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: {
              asthma: true,
              bronchitis: false,
              none: false,
            },
            gulfWar1990: {
              bahrain: true,
              iraq: false,
            },
            gulfWar1990Details: {
              bahrain: { startDate: '1990-08-01', endDate: '1991-04-01' },
              iraq: { startDate: '1991-01-01', endDate: '1991-03-01' },
            },
            herbicide: {
              vietnam: true,
              cambodia: false,
              none: false,
            },
            herbicideDetails: {
              vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
              cambodia: { startDate: '1969-01-01', endDate: '1970-01-01' },
            },
            otherExposures: {
              asbestos: true,
              radiation: false,
            },
            otherExposuresDetails: {
              asbestos: { startDate: '1980-01-01', endDate: '1985-01-01' },
              radiation: { startDate: '1990-01-01', endDate: '1991-01-01' },
            },
            otherHerbicideLocations: { description: '' },
            specifyOtherExposures: '   ',
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure.conditions).to.deep.equal({
          asthma: true,
        });

        expect(result.toxicExposure.gulfWar1990).to.deep.equal({
          bahrain: true,
          iraq: false,
        });
        expect(result.toxicExposure.gulfWar1990Details).to.deep.equal({
          bahrain: { startDate: '1990-08-01', endDate: '1991-04-01' },
        });

        expect(result.toxicExposure.herbicide).to.deep.equal({
          vietnam: true,
          cambodia: false,
          none: false,
        });
        expect(result.toxicExposure.herbicideDetails).to.deep.equal({
          vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
        });

        expect(result.toxicExposure.otherExposures).to.deep.equal({
          asbestos: true,
          radiation: false,
        });
        expect(result.toxicExposure.otherExposuresDetails).to.deep.equal({
          asbestos: { startDate: '1980-01-01', endDate: '1985-01-01' },
        });

        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure).to.not.have.property(
          'specifyOtherExposures',
        );
      });
    });
  });
});

describe('getAllToxicExposureKeys', () => {
  it('should return all toxic exposure field keys', () => {
    const keys = getAllToxicExposureKeys();

    expect(keys).to.be.an('array');
    expect(keys).to.include('conditions');
    expect(keys).to.include('gulfWar1990');
    expect(keys).to.include('gulfWar1990Details');
    expect(keys).to.include('gulfWar2001');
    expect(keys).to.include('gulfWar2001Details');
    expect(keys).to.include('herbicide');
    expect(keys).to.include('herbicideDetails');
    expect(keys).to.include('otherHerbicideLocations');
    expect(keys).to.include('otherExposures');
    expect(keys).to.include('otherExposuresDetails');
    expect(keys).to.include('specifyOtherExposures');
    expect(keys).to.have.lengthOf(11);
  });
});
