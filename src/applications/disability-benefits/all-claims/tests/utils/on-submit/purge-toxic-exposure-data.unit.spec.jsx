import { expect } from 'chai';
import {
  EXPOSURE_TYPE_MAPPING,
  purgeToxicExposureData,
} from '../../../utils/on-submit';

/**
 * Unit tests for purgeToxicExposureData function
 *
 * Verifies proper removal of orphaned toxic exposure data when users
 * opt out of sections in the disability compensation form.
 *
 * Key behaviors tested:
 * 1. Feature flag control - only processes when disability526ToxicExposureOptOutDataPurge is true
 * 2. "None" condition handling - keeps only conditions.none when selected alone
 * 3. Orphaned data removal - removes details without corresponding selections
 * 4. Detail retention - preserves details only for locations marked as true
 * 5. Specify field cleanup - removes otherHerbicideLocations and specifyOtherExposures when invalid
 * 6. False value preservation - maintains false selections while removing their details
 * 7. Cleanup of "other" fields when invalid or orphaned
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
            [EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey]: {
              bahrain: { startDate: '1991-01-01', endDate: '1991-12-31' },
            },
            herbicide: { vietnam: true },
            [EXPOSURE_TYPE_MAPPING.herbicide.detailsKey]: {
              vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
            },
            otherHerbicideLocations: { description: 'Thailand' },
            otherExposures: { asbestos: true },
            [EXPOSURE_TYPE_MAPPING.otherExposures.detailsKey]: {
              asbestos: { startDate: '1980-01-01', endDate: '1985-01-01' },
            },
            specifyOtherExposures: 'Lead exposure',
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure).to.deep.equal({
          conditions: { none: true },
        });
        // Verify only conditions.none remains
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
            [EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey]: {
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
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey],
        ).to.exist;
      });

      it('should remove false conditions while keeping true ones', () => {
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
            // gulfWar1990 exposure
            gulfWar1990: {
              bahrain: true,
              iraq: false,
            },
            [EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey]: {
              bahrain: { startDate: '1990-01-01', endDate: '1990-12-31' },
              iraq: { startDate: '1991-01-01', endDate: '1991-12-31' },
            },
            // gulfWar2001 exposure
            gulfWar2001: {
              afghanistan: true,
              yemen: false,
            },
            [EXPOSURE_TYPE_MAPPING.gulfWar2001.detailsKey]: {
              afghanistan: { startDate: '2001-10-01', endDate: '2002-10-01' },
              yemen: { startDate: '2002-01-01', endDate: '2003-01-01' },
            },
            // herbicide exposure
            herbicide: {
              vietnam: true,
              cambodia: false,
            },
            [EXPOSURE_TYPE_MAPPING.herbicide.detailsKey]: {
              vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
              cambodia: { startDate: '1969-01-01', endDate: '1970-01-01' },
            },
            // otherExposures exposure
            otherExposures: {
              asbestos: true,
              radiation: false,
            },
            [EXPOSURE_TYPE_MAPPING.otherExposures.detailsKey]: {
              asbestos: { startDate: '1980-01-01', endDate: '1985-01-01' },
              radiation: { startDate: '1990-01-01', endDate: '1991-01-01' },
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        // gulfWar1990 details
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey],
        ).to.have.property('bahrain');
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey],
        ).to.not.have.property('iraq');

        // gulfWar2001 details
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar2001.detailsKey],
        ).to.have.property('afghanistan');
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar2001.detailsKey],
        ).to.not.have.property('yemen');

        // herbicide details
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.detailsKey],
        ).to.have.property('vietnam');
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.detailsKey],
        ).to.not.have.property('cambodia');

        // otherExposures details
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.detailsKey],
        ).to.have.property('asbestos');
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.detailsKey],
        ).to.not.have.property('radiation');
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
            [EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey]: {
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

        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey],
        ).to.deep.equal({
          afghanistan: { startDate: '2001-10-01' },
        });
      });

      it('should purge orphaned details when main exposure selection is missing', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            [EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey]: {
              bahrain: { startDate: '1990-01-01', endDate: '1990-12-31' },
            },
            [EXPOSURE_TYPE_MAPPING.herbicide.detailsKey]: {
              vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey,
        );
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.detailsKey,
        );
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
            [EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey]: {
              afghanistan: { startDate: '2001-10-01' },
              bahrain: { startDate: '1990-08-15' },
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property('gulfWar1990');
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey,
        );
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
          EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
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
            [EXPOSURE_TYPE_MAPPING.herbicide.detailsKey]: {
              vietnam: { startDate: '1968-01-01' },
            },
            otherHerbicideLocations: { description: 'Other location' },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property('herbicide');
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.detailsKey,
        );
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
        );
      });

      it('should handle invalid data types gracefully', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: 'not-an-object', // Cloned as empty object by lodash
            gulfWar1990: 'not-an-object', // Cloned as empty object by lodash
            [EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey]: {
              bahrain: { startDate: '1990-01-01' },
            },
            herbicide: { vietnam: true },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure.conditions).to.deep.equal({});
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey,
        );
        expect(result.toxicExposure.herbicide).to.deep.equal({ vietnam: true });
      });

      it('should handle falsy values correctly: null fields removed, undefined preserved', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            gulfWar1990: null,
            herbicide: undefined,
            otherExposures: {
              asbestos: false,
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

    describe('other fields cleanup (otherHerbicideLocations & specifyOtherExposures)', () => {
      it('should remove other fields when no parent selections exist', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherHerbicideLocations: '   ',
            specifyOtherExposures: { description: 'Should be removed' },
          },
        };

        const result = purgeToxicExposureData(formData);
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
        );
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.otherExposures.otherKey,
        );
      });

      it('should retain fields with valid descriptions when exposures are selected', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: { vietnam: true },
            otherExposures: { asbestos: true },
            otherHerbicideLocations: 'Thailand base camps',
            specifyOtherExposures: { description: 'Lead exposure' },
          },
        };

        const result = purgeToxicExposureData(formData);
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.otherKey],
        ).to.equal('Thailand base camps');
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.otherKey],
        ).to.deep.equal({
          description: 'Lead exposure',
        });
      });

      it('should retain date data when exposures are selected', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: { thailand: true },
            otherExposures: { chemical: true },
            otherHerbicideLocations: {
              description: 'Thailand base camps',
              startDate: '1967-02-01',
              endDate: '1975-05-31',
            },
            specifyOtherExposures: {
              description: 'Lead exposure from paint',
              startDate: '1980-01-01',
              endDate: '1985-12-31',
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.otherKey],
        ).to.deep.equal({
          description: 'Thailand base camps',
          startDate: '1967-02-01',
          endDate: '1975-05-31',
        });

        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.otherKey],
        ).to.deep.equal({
          description: 'Lead exposure from paint',
          startDate: '1980-01-01',
          endDate: '1985-12-31',
        });
      });

      it('should handle mixed valid and invalid fields independently', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: { vietnam: true },
            otherExposures: { radiation: true },
            otherHerbicideLocations: {
              description: 'Thailand base camps',
              startDate: '1967-02-01',
              endDate: '1975-05-31',
            },
            specifyOtherExposures: {
              description: '   ',
              startDate: '1980-01-01',
              endDate: '1985-12-31',
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        // Both fields are retained because both herbicide and otherExposures have selections
        // We no longer validate description content
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.otherKey],
        ).to.deep.equal({
          description: 'Thailand base camps',
          startDate: '1967-02-01',
          endDate: '1975-05-31',
        });

        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.otherKey],
        ).to.deep.equal({
          description: '   ',
          startDate: '1980-01-01',
          endDate: '1985-12-31',
        });
      });

      it('should handle null other fields correctly', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: { laos: true },
            otherExposures: { asbestos: true },
            otherHerbicideLocations: null,
            specifyOtherExposures: {
              description: 'Asbestos exposure',
              startDate: '1980-01-01',
              endDate: '1985-12-31',
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        // null field should be removed as orphaned data
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
        );

        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.otherKey],
        ).to.deep.equal({
          description: 'Asbestos exposure',
          startDate: '1980-01-01',
          endDate: '1985-12-31',
        });
      });
    });

    describe('acceptance criteria test cases', () => {
      it('should remove entire toxicExposure when all conditions and exposures are false', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: {
              asthma: false,
              chronicBronchitis: false,
              sinusitis: false,
              rhinitis: false,
              sleepApnea: false,
              cancer: false,
              none: false,
            },
            gulfWar1990: {
              afghanistan: false,
              bahrain: false,
              iraq: false,
              kuwait: false,
              oman: false,
              qatar: false,
              saudiarabia: false,
              somalia: false,
              turkey: false,
              egypt: false,
              waters: false,
              airspace: false,
            },
            herbicide: {
              cambodia: false,
              guam: false,
              johnston: false,
              koreandemilitarizedzone: false,
              laos: false,
              c123: false,
              thailand: false,
              vietnam: false,
              none: false,
            },
            otherExposures: {
              asbestos: false,
              chemical: false,
              chromium: false,
              depleted: false,
              mos: false,
              mustardGas: false,
              radiation: false,
              shad: false,
              shipyard: false,
              water: false,
              other: false,
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result).to.not.have.property('toxicExposure');
      });

      it('should remove specifyOtherExposures when all otherExposures are false', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherExposures: {
              asbestos: false,
              chemical: false,
              chromium: false,
              depleted: false,
              mos: false,
              mustardGas: false,
              radiation: false,
              shad: false,
              shipyard: false,
              water: false,
              other: false,
            },
            specifyOtherExposures: {
              description: 'This should be removed - all exposures are false',
              startDate: '2012-03-15',
              endDate: '2013-09-30',
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.otherExposures.otherKey,
        );
        expect(result.toxicExposure).to.not.have.property('otherExposures');
      });

      it('should remove otherHerbicideLocations when all herbicide exposures are false', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: {
              cambodia: false,
              guam: false,
              johnston: false,
              koreandemilitarizedzone: false,
              laos: false,
              c123: false,
              thailand: false,
              vietnam: false,
              none: false,
            },
            otherHerbicideLocations: {
              description: 'This should be removed - all herbicides are false',
              startDate: '1973-06-01',
              endDate: '1974-12-31',
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
        );
        expect(result.toxicExposure).to.not.have.property('herbicide');
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

      it('should handle missing conditions without removing valid exposure data', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            gulfWar1990: { bahrain: true },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure.gulfWar1990).to.deep.equal({
          bahrain: true,
        });
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
            [EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey]: {
              bahrain: { startDate: '1990-08-01', endDate: '1991-04-01' },
              iraq: { startDate: '1991-01-01', endDate: '1991-03-01' },
            },
            herbicide: {
              vietnam: true,
              cambodia: false,
              none: false,
            },
            [EXPOSURE_TYPE_MAPPING.herbicide.detailsKey]: {
              vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
              cambodia: { startDate: '1969-01-01', endDate: '1970-01-01' },
            },
            otherExposures: {
              asbestos: true,
              radiation: false,
            },
            [EXPOSURE_TYPE_MAPPING.otherExposures.detailsKey]: {
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
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey],
        ).to.deep.equal({
          bahrain: { startDate: '1990-08-01', endDate: '1991-04-01' },
        });

        expect(result.toxicExposure.herbicide).to.deep.equal({
          vietnam: true,
          cambodia: false,
          none: false,
        });
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.detailsKey],
        ).to.deep.equal({
          vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
        });

        expect(result.toxicExposure.otherExposures).to.deep.equal({
          asbestos: true,
          radiation: false,
        });
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.detailsKey],
        ).to.deep.equal({
          asbestos: { startDate: '1980-01-01', endDate: '1985-01-01' },
        });

        // Since herbicide and otherExposures have selections, their other fields are retained
        // We no longer validate description content
        expect(result.toxicExposure).to.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
        );
        expect(result.toxicExposure).to.have.property(
          EXPOSURE_TYPE_MAPPING.otherExposures.otherKey,
        );
      });
    });
  });
});

describe('purgeToxicExposureData - orphaned data removal', () => {
  it('should keep all fields including unknown ones (only removes orphaned data)', () => {
    const mockData = {
      disability526ToxicExposureOptOutDataPurge: true,
      toxicExposure: {
        conditions: { asthma: true },
        gulfWar1990: { iraq: true },
        invalidField: 'This should be kept (not our job to validate)',
        anotherInvalidField: { nested: 'This should also be kept' },
        unknownKey: true,
        randomData: [1, 2, 3],
      },
    };

    const result = purgeToxicExposureData(mockData);

    expect(result.toxicExposure).to.have.property('invalidField');
    expect(result.toxicExposure).to.have.property('anotherInvalidField');
    expect(result.toxicExposure).to.have.property('unknownKey');
    expect(result.toxicExposure).to.have.property('randomData');
    expect(result.toxicExposure).to.have.property('conditions');
    expect(result.toxicExposure).to.have.property('gulfWar1990');
  });

  it('should process maximal test data removing only orphaned details', () => {
    // Mock maximal test data with mixed true/false selections
    const mockMaximalData = {
      disability526ToxicExposureOptOutDataPurge: true,
      toxicExposure: {
        conditions: {
          asthma: true,
          chronicBronchitis: true,
          sinusitis: false,
          rhinitis: false,
          sleepApnea: true,
          cancer: false,
          none: false,
        },
        gulfWar1990: {
          afghanistan: true,
          bahrain: false,
          iraq: false,
          kuwait: true,
          oman: false,
          qatar: false,
          saudiarabia: true,
          somalia: false,
          turkey: false,
          egypt: false,
          waters: false,
          airspace: true,
        },
        gulfWar1990Details: {
          afghanistan: {
            startDate: '2001-10-01',
            endDate: '2005-12-31',
          },
          bahrain: {
            startDate: '1990-08-15',
            endDate: '1991-04-30',
          },
          iraq: {
            startDate: '2003-03-01',
            endDate: '2004-06-30',
          },
          kuwait: {
            startDate: '1991-01-15',
            endDate: '1991-05-01',
          },
          saudiarabia: {
            startDate: '1990-08-01',
            endDate: '1991-06-30',
          },
          airspace: {
            startDate: '1990-08-02',
            endDate: '1991-04-20',
          },
        },
        herbicide: {
          vietnam: true,
          cambodia: false,
          laos: true,
          thailand: true,
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
          laos: {
            startDate: '1965-01-01',
            endDate: '1975-01-01',
          },
          thailand: {
            startDate: '1969-05-01',
            endDate: '1975-06-01',
          },
        },
        otherHerbicideLocations: {
          description:
            'Agent Orange testing facility in Nevada desert, classified location',
          startDate: '1973-06-01',
          endDate: '1974-12-31',
        },
        otherExposures: {
          asbestos: true,
          chemical: false,
          chromium: false,
          depleted: true,
          mos: false,
          mustardGas: false,
          radiation: true,
          shad: false,
          shipyard: true,
          water: false,
          other: true,
        },
        otherExposuresDetails: {
          asbestos: {
            startDate: '1995-03-12',
            endDate: '2000-05-30',
          },
          chemical: {
            startDate: '1999-01-01',
            endDate: '2000-01-01',
          },
          depleted: {
            startDate: '2003-03-01',
            endDate: '2004-12-31',
          },
          radiation: {
            startDate: '2001-09-11',
            endDate: '2002-01-15',
          },
          shipyard: {
            startDate: '1988-06-01',
            endDate: '1993-10-31',
          },
          other: {
            startDate: '2005-01-01',
            endDate: '2010-12-31',
          },
        },
        specifyOtherExposures: {
          description:
            'Exposed to experimental chemical agents during classified military testing operations',
          startDate: '2012-03-15',
          endDate: '2013-09-30',
        },
      },
    };

    const result = purgeToxicExposureData(mockMaximalData);

    expect(result.toxicExposure).to.have.property('conditions');
    expect(result.toxicExposure.conditions).to.deep.equal({
      asthma: true,
      chronicBronchitis: true,
      sleepApnea: true,
    });

    expect(result.toxicExposure).to.have.property('gulfWar1990');
    expect(result.toxicExposure.gulfWar1990.afghanistan).to.be.true;
    expect(result.toxicExposure.gulfWar1990.kuwait).to.be.true;
    expect(result.toxicExposure.gulfWar1990.saudiarabia).to.be.true;
    expect(result.toxicExposure.gulfWar1990.airspace).to.be.true;
    expect(result.toxicExposure.gulfWar1990.bahrain).to.be.false;
    expect(result.toxicExposure.gulfWar1990.iraq).to.be.false;

    expect(result.toxicExposure).to.have.property('gulfWar1990Details');
    expect(result.toxicExposure.gulfWar1990Details).to.have.property(
      'afghanistan',
    );
    expect(result.toxicExposure.gulfWar1990Details).to.have.property('kuwait');
    expect(result.toxicExposure.gulfWar1990Details).to.have.property(
      'saudiarabia',
    );
    expect(result.toxicExposure.gulfWar1990Details).to.have.property(
      'airspace',
    );
    expect(result.toxicExposure.gulfWar1990Details).to.not.have.property(
      'bahrain',
    );
    expect(result.toxicExposure.gulfWar1990Details).to.not.have.property(
      'iraq',
    );

    // Verify herbicide data - false values retained, orphaned details removed
    expect(result.toxicExposure).to.have.property('herbicide');
    expect(result.toxicExposure.herbicide.vietnam).to.be.true;
    expect(result.toxicExposure.herbicide.cambodia).to.be.false;
    expect(result.toxicExposure.herbicide.laos).to.be.true;
    expect(result.toxicExposure.herbicide.thailand).to.be.true;

    expect(result.toxicExposure).to.have.property('herbicideDetails');
    expect(result.toxicExposure.herbicideDetails).to.have.property('vietnam');
    expect(result.toxicExposure.herbicideDetails).to.have.property('laos');
    expect(result.toxicExposure.herbicideDetails).to.have.property('thailand');
    expect(result.toxicExposure.herbicideDetails).to.not.have.property(
      'cambodia',
    );

    // Verify otherExposures data - false values retained, orphaned details removed
    expect(result.toxicExposure).to.have.property('otherExposures');
    expect(result.toxicExposure.otherExposures.asbestos).to.be.true;
    expect(result.toxicExposure.otherExposures.chemical).to.be.false;
    expect(result.toxicExposure.otherExposures.depleted).to.be.true;
    expect(result.toxicExposure.otherExposures.radiation).to.be.true;
    expect(result.toxicExposure.otherExposures.shipyard).to.be.true;
    expect(result.toxicExposure.otherExposures.other).to.be.true;

    expect(result.toxicExposure).to.have.property('otherExposuresDetails');
    expect(result.toxicExposure.otherExposuresDetails).to.have.property(
      'asbestos',
    );
    expect(result.toxicExposure.otherExposuresDetails).to.have.property(
      'depleted',
    );
    expect(result.toxicExposure.otherExposuresDetails).to.have.property(
      'radiation',
    );
    expect(result.toxicExposure.otherExposuresDetails).to.have.property(
      'shipyard',
    );
    expect(result.toxicExposure.otherExposuresDetails).to.have.property(
      'other',
    );
    expect(result.toxicExposure.otherExposuresDetails).to.not.have.property(
      'chemical',
    );

    // Verify specify fields are retained
    expect(result.toxicExposure).to.have.property(
      EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
    );
    expect(
      result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.otherKey],
    ).to.deep.equal({
      description:
        'Agent Orange testing facility in Nevada desert, classified location',
      startDate: '1973-06-01',
      endDate: '1974-12-31',
    });

    expect(result.toxicExposure).to.have.property(
      EXPOSURE_TYPE_MAPPING.otherExposures.otherKey,
    );
    expect(
      result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.otherKey],
    ).to.deep.equal({
      description:
        'Exposed to experimental chemical agents during classified military testing operations',
      startDate: '2012-03-15',
      endDate: '2013-09-30',
    });
  });
});
