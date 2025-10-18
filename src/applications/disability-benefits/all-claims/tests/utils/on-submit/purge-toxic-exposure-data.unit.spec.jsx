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
 * 1. Feature flag control - processes when either disability526ToxicExposureOptOutDataPurge OR disability526ToxicExposureOptOutDataPurgeByUser is true
 * 2. "None" condition handling - keeps only conditions.none when selected alone
 * 3. Orphaned data removal - removes details without corresponding selections
 * 4. Detail retention - preserves details only for locations marked as true
 * 5. "Other" field cleanup - removes otherHerbicideLocations/specifyOtherExposures when null/empty/whitespace (supports both string and object formats)
 * 6. False value preservation - maintains false selections while removing their details (except when 'none' selected or no conditions)
 * 7. Null field cleanup - removes null fields
 */
describe('purgeToxicExposureData', () => {
  describe('when feature flag is disabled', () => {
    it('should not purge when both flags are false', () => {
      const formData = {
        disability526ToxicExposureOptOutDataPurge: false,
        disability526ToxicExposureOptOutDataPurgeByUser: false,
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: { bahrain: true },
        },
      };

      const result = purgeToxicExposureData(formData);
      expect(result).to.deep.equal(formData);
    });

    it('should not purge when both flags are undefined', () => {
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

  describe('when either feature flag is enabled', () => {
    it('should purge when disability526ToxicExposureOptOutDataPurge is true', () => {
      const formData = {
        disability526ToxicExposureOptOutDataPurge: true,
        disability526ToxicExposureOptOutDataPurgeByUser: false,
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: { bahrain: true },
          gulfWar1990Details: {
            bahrain: { startDate: '1991-01-01', endDate: '1991-12-31' },
          },
        },
      };

      const result = purgeToxicExposureData(formData);
      expect(result.toxicExposure).to.deep.equal({
        conditions: { none: true },
      });
    });

    it('should purge when disability526ToxicExposureOptOutDataPurgeByUser is true', () => {
      const formData = {
        disability526ToxicExposureOptOutDataPurge: false,
        disability526ToxicExposureOptOutDataPurgeByUser: true,
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: { bahrain: true },
          gulfWar1990Details: {
            bahrain: { startDate: '1991-01-01', endDate: '1991-12-31' },
          },
        },
      };

      const result = purgeToxicExposureData(formData);
      expect(result.toxicExposure).to.deep.equal({
        conditions: { none: true },
      });
    });

    it('should purge when both flags are true', () => {
      const formData = {
        disability526ToxicExposureOptOutDataPurge: true,
        disability526ToxicExposureOptOutDataPurgeByUser: true,
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: { bahrain: true },
          gulfWar1990Details: {
            bahrain: { startDate: '1991-01-01', endDate: '1991-12-31' },
          },
        },
      };

      const result = purgeToxicExposureData(formData);
      expect(result.toxicExposure).to.deep.equal({
        conditions: { none: true },
      });
    });
  });

  describe('when feature flag is enabled', () => {
    describe('with no toxic exposure data', () => {
      it('should handle missing or empty toxicExposure', () => {
        // Missing toxicExposure
        const missingData = {
          disability526ToxicExposureOptOutDataPurge: true,
          newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        };
        expect(purgeToxicExposureData(missingData)).to.deep.equal(missingData);

        // Empty toxicExposure
        const emptyData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: {},
            gulfWar1990: {},
            herbicide: null,
          },
        };
        expect(purgeToxicExposureData(emptyData)).to.not.have.property(
          'toxicExposure',
        );
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
      it('should retain exposure data when conditions are selected', () => {
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
    });

    describe('exposure detail purging', () => {
      it('should retain details only for locations marked as true', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            // Gulf War 1990 exposure
            gulfWar1990: {
              bahrain: true,
              iraq: false,
            },
            [EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey]: {
              bahrain: { startDate: '1990-01-01', endDate: '1990-12-31' },
              iraq: { startDate: '1991-01-01', endDate: '1991-12-31' },
            },
            // Gulf War 2001 exposure
            gulfWar2001: {
              afghanistan: true,
              yemen: false,
            },
            [EXPOSURE_TYPE_MAPPING.gulfWar2001.detailsKey]: {
              afghanistan: { startDate: '2001-10-01', endDate: '2002-10-01' },
              yemen: { startDate: '2002-01-01', endDate: '2003-01-01' },
            },
            // Herbicide exposure
            herbicide: {
              vietnam: true,
              cambodia: false,
            },
            [EXPOSURE_TYPE_MAPPING.herbicide.detailsKey]: {
              vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
              cambodia: { startDate: '1969-01-01', endDate: '1970-01-01' },
            },
            // Other exposures
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

        // Gulf War 1990 details
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey],
        ).to.have.property('bahrain');
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey],
        ).to.not.have.property('iraq');

        // Gulf War 2001 details
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar2001.detailsKey],
        ).to.have.property('afghanistan');
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar2001.detailsKey],
        ).to.not.have.property('yemen');

        // Herbicide details
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.detailsKey],
        ).to.have.property('vietnam');
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.detailsKey],
        ).to.not.have.property('cambodia');

        // Other exposures details
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.detailsKey],
        ).to.have.property('asbestos');
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.detailsKey],
        ).to.not.have.property('radiation');
      });

      it('should preserve false location selections while removing their details', () => {
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

      it('should remove orphaned details when parent exposure object is missing (hasOrphanedDetails check)', () => {
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

      it('should remove orphaned otherHerbicideLocations when sibling herbicide object is missing (hasOrphanedOtherKey check)', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            // No herbicide sibling object
            [EXPOSURE_TYPE_MAPPING.herbicide.detailsKey]: {
              vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
            },
            otherHerbicideLocations: {
              description: 'Thailand base camps',
              startDate: '1973-06-01',
              endDate: '1974-12-31',
            },
            // Similar test for otherExposures
            [EXPOSURE_TYPE_MAPPING.otherExposures.detailsKey]: {
              asbestos: { startDate: '1980-01-01', endDate: '1985-01-01' },
            },
            specifyOtherExposures: {
              description: 'Lead exposure',
              startDate: '1980-01-01',
              endDate: '1985-01-01',
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        // Both details and otherKey fields should be removed when sibling is missing
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.detailsKey,
        );
        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.otherExposures.detailsKey,
        );
        expect(result.toxicExposure).to.not.have.property(
          'specifyOtherExposures',
        );
      });

      it('should remove details object when all details are filtered out (hasNoRetainedDetails check)', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            gulfWar1990: {
              iraq: true,
              bahrain: false,
            },
            [EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey]: {
              // Only details for locations that are false - will result in empty object after filtering
              bahrain: { startDate: '1990-01-01', endDate: '1990-12-31' },
              kuwait: { startDate: '1991-01-01', endDate: '1991-12-31' },
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        // The details object should be removed entirely when empty after filtering
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey,
        );
        expect(result.toxicExposure.gulfWar1990).to.deep.equal({
          iraq: true,
          bahrain: false,
        });
      });

      it('should remove otherHerbicideLocations when herbicide.none is selected (hasNoneSelected check)', () => {
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

      it('should remove entire section when all values are false (shouldRemoveSection check)', () => {
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

        // Both sections should be removed when all values are false
        expect(result.toxicExposure).to.not.have.property('gulfWar1990');
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey,
        );
        expect(result.toxicExposure).to.not.have.property('herbicide');
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.detailsKey,
        );
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
        );
      });

      it('should handle invalid and falsy values correctly', () => {
        // Invalid data types
        const invalidData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            gulfWar1990: 'not-an-object',
            [EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey]: {
              bahrain: { startDate: '1990-01-01' },
            },
            herbicide: { vietnam: true },
          },
        };
        let result = purgeToxicExposureData(invalidData);
        expect(result.toxicExposure.conditions).to.deep.equal({ asthma: true });
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey,
        );
        expect(result.toxicExposure.herbicide).to.deep.equal({ vietnam: true });

        // Null and undefined values
        const falsyData = {
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
        result = purgeToxicExposureData(falsyData);
        expect(result.toxicExposure).to.not.have.property('gulfWar1990');
        expect(result.toxicExposure).to.have.property('herbicide');
        expect(result.toxicExposure.herbicide).to.be.undefined;
        expect(result.toxicExposure.otherExposures.asbestos).to.equal(false);
        expect(result.toxicExposure.otherExposures.radiation).to.equal(true);
      });
    });

    describe('other fields cleanup (otherHerbicideLocations & specifyOtherExposures)', () => {
      it('should remove other fields when no parent selections exist (shouldRemoveOtherField check)', () => {
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

      it('should preserve other fields with various data structures when they have valid descriptions', () => {
        // Test string value
        const stringData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: { vietnam: true },
            otherHerbicideLocations: 'Thailand base camps',
          },
        };
        let result = purgeToxicExposureData(stringData);
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.otherKey],
        ).to.equal('Thailand base camps');

        // Test object with dates and description
        const dateData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherExposures: { chemical: true },
            specifyOtherExposures: {
              description: 'Lead exposure from paint',
              startDate: '1980-01-01',
              endDate: '1985-12-31',
            },
          },
        };
        result = purgeToxicExposureData(dateData);
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.otherKey],
        ).to.deep.equal({
          description: 'Lead exposure from paint',
          startDate: '1980-01-01',
          endDate: '1985-12-31',
        });
      });

      it('should remove null other fields and preserve fields with valid descriptions', () => {
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

        // Null field should be removed as orphaned data
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
        );

        // Field with valid description should be preserved
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.otherKey],
        ).to.deep.equal({
          description: 'Asbestos exposure',
          startDate: '1980-01-01',
          endDate: '1985-12-31',
        });
      });

      it('should remove other fields when description is empty or whitespace only', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: { vietnam: true },
            otherExposures: { asbestos: true },
            otherHerbicideLocations: {
              description: '', // Empty string
              startDate: '1973-06-01',
              endDate: '1974-12-31',
            },
            specifyOtherExposures: {
              description: '   ', // Whitespace only
              startDate: '1980-01-01',
              endDate: '1985-01-01',
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        // Both should be removed due to empty/whitespace descriptions
        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure).to.not.have.property(
          'specifyOtherExposures',
        );
      });

      it('should remove other fields when set to undefined', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: { vietnam: true },
            otherExposures: { asbestos: true },
            otherHerbicideLocations: undefined, // Undefined value
            specifyOtherExposures: undefined, // Undefined value
          },
        };

        const result = purgeToxicExposureData(formData);

        // Both should be removed - undefined is treated as unknown format (empty)
        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure).to.not.have.property(
          'specifyOtherExposures',
        );
      });
    });

    describe('acceptance criteria - UX test cases', () => {
      it('should handle complete opt-out scenario when all conditions and exposures are false (hasNoSelections check)', () => {
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

      it('should remove other fields when all parent exposures are false (hasNoSelections and shouldRemoveOtherField check)', () => {
        // Test otherExposures field removal
        const exposuresData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherExposures: {
              asbestos: false,
              chemical: false,
              radiation: false,
              other: false,
            },
            specifyOtherExposures: {
              description: 'This should be removed - all exposures are false',
              startDate: '2012-03-15',
              endDate: '2013-09-30',
            },
          },
        };
        const result1 = purgeToxicExposureData(exposuresData);
        expect(result1.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.otherExposures.otherKey,
        );
        expect(result1.toxicExposure).to.not.have.property('otherExposures');

        // Test herbicide field removal
        const herbicideData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: {
              cambodia: false,
              vietnam: false,
              thailand: false,
              none: false,
            },
            otherHerbicideLocations: {
              description: 'This should be removed - all herbicides are false',
              startDate: '1973-06-01',
              endDate: '1974-12-31',
            },
          },
        };
        const result2 = purgeToxicExposureData(herbicideData);
        expect(result2.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
        );
        expect(result2.toxicExposure).to.not.have.property('herbicide');
      });
    });

    describe('orphaned data paths - complete coverage', () => {
      it('should handle NULL exposure fields as orphaned data (isExposureNull check)', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            gulfWar1990: null,
            gulfWar2001: null,
            herbicide: null,
            otherExposures: null,
            otherHerbicideLocations: null,
            specifyOtherExposures: null,
          },
        };

        const result = purgeToxicExposureData(formData);

        // All null fields should be removed
        expect(result.toxicExposure).to.not.have.property('gulfWar1990');
        expect(result.toxicExposure).to.not.have.property('gulfWar2001');
        expect(result.toxicExposure).to.not.have.property('herbicide');
        expect(result.toxicExposure).to.not.have.property('otherExposures');
        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure).to.not.have.property(
          'specifyOtherExposures',
        );
        expect(result.toxicExposure.conditions).to.deep.equal({ asthma: true });
      });

      it('should handle details without matching parent selections (shouldFilterDetails check)', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            gulfWar1990: { iraq: true },
            gulfWar1990Details: {
              iraq: { startDate: '1991-01-01' },
              kuwait: { startDate: '1991-02-01' }, // No parent selection
            },
            herbicideDetails: {
              vietnam: { startDate: '1968-01-01' }, // No parent herbicide object
            },
            otherExposures: { asbestos: true },
            otherExposuresDetails: {
              asbestos: { startDate: '1980-01-01' },
              radiation: { startDate: '1990-01-01' }, // No parent selection
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        // Only matching details should remain
        expect(result.toxicExposure.gulfWar1990Details).to.deep.equal({
          iraq: { startDate: '1991-01-01' },
        });
        expect(result.toxicExposure).to.not.have.property('herbicideDetails');
        expect(result.toxicExposure.otherExposuresDetails).to.deep.equal({
          asbestos: { startDate: '1980-01-01' },
        });
      });

      it('should handle UNDEFINED parent exposures - details become orphaned (hasOrphanedDetails check)', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            // Gulf War 1990 is undefined
            gulfWar1990Details: {
              iraq: { startDate: '1991-01-01' }, // Orphaned - no parent
            },
            // Herbicide is undefined
            herbicideDetails: {
              vietnam: { startDate: '1968-01-01' }, // Orphaned - no parent
            },
            otherHerbicideLocations: { description: 'Test' }, // Orphaned - no parent
            // Other exposures is undefined
            otherExposuresDetails: {
              asbestos: { startDate: '1980-01-01' }, // Orphaned - no parent
            },
            specifyOtherExposures: { description: 'Test' }, // Orphaned - no parent
          },
        };

        const result = purgeToxicExposureData(formData);

        // All details without parents should be removed
        expect(result.toxicExposure).to.not.have.property('gulfWar1990Details');
        expect(result.toxicExposure).to.not.have.property('herbicideDetails');
        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure).to.not.have.property(
          'otherExposuresDetails',
        );
        expect(result.toxicExposure).to.not.have.property(
          'specifyOtherExposures',
        );
      });

      it('should handle exposure sections with none: true mixed with other selections (hasNoneSelected and shouldRemoveOtherField check)', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            gulfWar1990: { none: true, iraq: true }, // Has other selection, will be kept
            gulfWar2001: { none: true }, // Only none, will be removed
            herbicide: { none: true, vietnam: true }, // Has other selection, will be kept
            otherExposures: { none: true, asbestos: true }, // Has other selection, will be kept
            otherHerbicideLocations: { description: 'Test' }, // Should be removed when none: true
            specifyOtherExposures: { description: 'Test' }, // Should be removed when none: true
          },
        };

        const result = purgeToxicExposureData(formData);

        // Sections with ONLY none: true should be removed
        expect(result.toxicExposure).to.not.have.property('gulfWar2001');

        // Sections with none: true AND other selections should be kept
        expect(result.toxicExposure).to.have.property('gulfWar1990');
        expect(result.toxicExposure).to.have.property('herbicide');
        expect(result.toxicExposure).to.have.property('otherExposures');

        // But other fields should be removed when none is selected
        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure).to.not.have.property(
          'specifyOtherExposures',
        );
      });

      it('should follow cleanup priority order correctly (all condition checks in sequence)', () => {
        // Test priority: 1. Feature flag, 2. conditions.none, 3. null fields, 4. all false, 5. orphaned details
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true, // Priority 1: Flag enabled
          toxicExposure: {
            conditions: { asthma: true, cancer: false }, // Priority 2: Not only none
            gulfWar1990: null, // Priority 3a: Null field
            gulfWar2001: {
              // Priority 3b: All false
              afghanistan: false,
              yemen: false,
            },
            herbicide: {
              // Priority 3c: Has true values
              vietnam: true,
              cambodia: false,
            },
            herbicideDetails: {
              // Priority 3d: Mixed orphaned details
              vietnam: { startDate: '1968-01-01' }, // Valid
              cambodia: { startDate: '1969-01-01' }, // Orphaned (parent false)
              laos: { startDate: '1970-01-01' }, // Orphaned (no parent)
            },
            otherExposures: { asbestos: true },
            otherHerbicideLocations: null, // Priority 3e: Null other field
            specifyOtherExposures: { description: 'Valid' }, // Valid - has description
          },
        };

        const result = purgeToxicExposureData(formData);

        // Verify priority order was followed
        expect(result.toxicExposure).to.exist; // Flag was true
        expect(result.toxicExposure.conditions).to.deep.equal({
          asthma: true,
          cancer: false,
        }); // False values kept
        expect(result.toxicExposure).to.not.have.property('gulfWar1990'); // Null removed
        expect(result.toxicExposure).to.not.have.property('gulfWar2001'); // All false removed
        expect(result.toxicExposure.herbicide).to.deep.equal({
          vietnam: true,
          cambodia: false,
        });
        expect(result.toxicExposure.herbicideDetails).to.deep.equal({
          vietnam: { startDate: '1968-01-01' }, // Only valid detail kept
        });
        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        ); // Null removed
        expect(result.toxicExposure.specifyOtherExposures).to.deep.equal({
          description: 'Valid',
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

      it('should remove entire toxicExposure when no conditions are selected (hasSelectedConditions check)', () => {
        // Empty conditions
        const emptyConditions = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: {},
            gulfWar1990: { bahrain: true },
          },
        };
        expect(purgeToxicExposureData(emptyConditions).toxicExposure).to.be
          .undefined;

        // Missing conditions
        const missingConditions = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            gulfWar1990: { bahrain: true },
            herbicide: { vietnam: true },
          },
        };
        expect(purgeToxicExposureData(missingConditions).toxicExposure).to.be
          .undefined;

        // All false conditions
        const falseConditions = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: false, cancer: false },
            gulfWar1990: { bahrain: true },
          },
        };
        expect(purgeToxicExposureData(falseConditions).toxicExposure).to.be
          .undefined;
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

      it('should remove entire toxicExposure when no meaningful data remains (hasNoMeaningfulData check)', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: {}, // Empty object after false values removed
            gulfWar1990: {}, // Empty object after cleanup
            herbicideDetails: {}, // Empty object after cleanup
            otherExposures: null, // Null will be filtered as not meaningful
            specifyOtherExposures: undefined, // Undefined will be filtered as not meaningful
          },
        };

        const result = purgeToxicExposureData(formData);

        // The entire toxicExposure should be removed when it has no meaningful data
        expect(result.toxicExposure).to.be.undefined;
        expect(result).to.not.have.property('toxicExposure');
      });
    });

    describe('integration tests', () => {
      it('should handle complex form data with mixed true/false selections and preserve valid data (shouldFilterDetails and hasValidSelections check)', () => {
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
          bronchitis: false,
          none: false,
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

        // otherHerbicideLocations and specifyOtherExposures should be removed
        // because their descriptions are empty or whitespace-only
        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
        );
        expect(result.toxicExposure).to.not.have.property(
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

  it('should preserve unknown/future fields in exposure selections and their details (forward compatibility)', () => {
    // This test ensures that when new exposure types are added to the constants
    // (e.g., new values in HERBICIDE_LOCATIONS or ADDITIONAL_EXPOSURES),
    // the purge logic preserves them and their details based on selection status,
    // just like it handles known fields.
    const formData = {
      disability526ToxicExposureOptOutDataPurge: true,
      toxicExposure: {
        conditions: { asthma: true },
        // Herbicide with unknown future fields not in current HERBICIDE_LOCATIONS
        herbicide: {
          vietnam: true,
          cambodia: false,
          futureLocation1: true, // Unknown field - should be preserved
          futureLocation2: false, // Unknown field - false should be preserved
        },
        herbicideDetails: {
          vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
          cambodia: { startDate: '1969-01-01', endDate: '1970-01-01' }, // Should be removed (false)
          futureLocation1: { startDate: '1975-01-01', endDate: '1976-01-01' }, // Should be kept (true)
          futureLocation2: { startDate: '1977-01-01', endDate: '1978-01-01' }, // Should be removed (false)
        },
        otherHerbicideLocations: {
          description: 'Other location description',
          startDate: '1973-06-01',
          endDate: '1974-12-31',
        },
        // Other exposures with unknown future fields not in current ADDITIONAL_EXPOSURES
        otherExposures: {
          asbestos: true,
          radiation: false,
          futureExposure1: true, // Unknown field - should be preserved
          futureExposure2: false, // Unknown field - false should be preserved
        },
        otherExposuresDetails: {
          asbestos: { startDate: '1980-01-01', endDate: '1985-01-01' },
          radiation: { startDate: '1990-01-01', endDate: '1991-01-01' }, // Should be removed (false)
          futureExposure1: { startDate: '2000-01-01', endDate: '2001-01-01' }, // Should be kept (true)
          futureExposure2: { startDate: '2002-01-01', endDate: '2003-01-01' }, // Should be removed (false)
        },
        specifyOtherExposures: {
          description: 'Future exposure description',
          startDate: '2012-03-15',
          endDate: '2013-09-30',
        },
      },
    };

    const result = purgeToxicExposureData(formData);

    // Herbicide section should preserve unknown fields based on their selection status
    expect(result.toxicExposure.herbicide).to.deep.equal({
      vietnam: true,
      cambodia: false,
      futureLocation1: true,
      futureLocation2: false,
    });

    // Herbicide details should only keep details for true selections (including unknown fields)
    expect(result.toxicExposure.herbicideDetails).to.deep.equal({
      vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
      futureLocation1: { startDate: '1975-01-01', endDate: '1976-01-01' },
    });

    // otherHerbicideLocations should be preserved when valid
    expect(result.toxicExposure.otherHerbicideLocations).to.deep.equal({
      description: 'Other location description',
      startDate: '1973-06-01',
      endDate: '1974-12-31',
    });

    // Other exposures should preserve unknown fields based on their selection status
    expect(result.toxicExposure.otherExposures).to.deep.equal({
      asbestos: true,
      radiation: false,
      futureExposure1: true,
      futureExposure2: false,
    });

    // Other exposure details should only keep details for true selections (including unknown fields)
    expect(result.toxicExposure.otherExposuresDetails).to.deep.equal({
      asbestos: { startDate: '1980-01-01', endDate: '1985-01-01' },
      futureExposure1: { startDate: '2000-01-01', endDate: '2001-01-01' },
    });

    // specifyOtherExposures should be preserved when valid
    expect(result.toxicExposure.specifyOtherExposures).to.deep.equal({
      description: 'Future exposure description',
      startDate: '2012-03-15',
      endDate: '2013-09-30',
    });
  });

  it('should handle maximal data set removing only orphaned details for false selections', () => {
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
          other: true,
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
      sinusitis: false,
      rhinitis: false,
      sleepApnea: true,
      cancer: false,
      none: false,
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
