import { expect } from 'chai';
import {
  EXPOSURE_TYPE_MAPPING,
  purgeToxicExposureData,
} from '../../../utils/on-submit';

/**
 * Unit tests for purgeToxicExposureData function
 *
 * Verifies removal of toxic exposure data when users explicitly opt out of sections.
 *
 * Key behaviors tested:
 * 1. Feature flag control - purge only runs when flag is enabled
 * 2. No conditions selected - keeps only conditions object, removes orphaned exposure data
 * 3. gulfWar sections with none=true - removes section and details
 * 4. gulfWar detail filtering - filters details based on checkbox state
 * 5. Orphaned dates removal - removes otherHerbicideLocations/specifyOtherExposures when no description
 * 6. Valid description preservation - keeps other fields when they have valid descriptions
 * 7. All sections filter details based on checkbox state
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
    describe('basic purge behavior', () => {
      it('should purge when disability526ToxicExposureOptOutDataPurge is true', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
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

    describe('with no toxic exposure data', () => {
      it('should handle missing or empty toxicExposure', () => {
        // Missing toxicExposure - returns unchanged
        const missingData = {
          disability526ToxicExposureOptOutDataPurge: true,
          newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        };
        expect(purgeToxicExposureData(missingData)).to.deep.equal(missingData);

        // Empty toxicExposure with empty conditions - returns unchanged
        // No actual user data to purge (just empty form scaffolding)
        // This prevents false positive "data purged" logging
        const emptyData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: {},
            gulfWar1990: {},
            herbicide: null,
          },
        };
        const result = purgeToxicExposureData(emptyData);
        // No actual data = return unchanged (avoid false positive logging)
        expect(result).to.deep.equal(emptyData);
      });
    });

    describe('with "none" condition selected', () => {
      it('should return unchanged when none condition selected but no actual data (false positive prevention)', () => {
        // This prevents false positive "data purged" logging on the backend
        // User selected "no" to claiming toxic exposure but never entered any exposure data
        // The form scaffolding (empty objects) should NOT be purged
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { none: true },
            gulfWar1990: {}, // Empty - just form initialization, no user data
            gulfWar1990Details: {
              afghanistan: {},
              bahrain: {},
              iraq: {},
            }, // Empty nested objects - form scaffolding
            herbicide: {},
            otherExposures: {},
          },
        };

        const result = purgeToxicExposureData(formData);

        // No actual data = return unchanged (avoid false positive logging)
        expect(result).to.deep.equal(formData);
      });

      it('should purge when none condition selected AND has actual exposure data', () => {
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
      it('should filter details based on checkbox state for all sections', () => {
        // All sections filter details based on checkbox state
        // When checkbox is false, corresponding details entry is removed
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

        // Gulf War 1990 details filtered
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey],
        ).to.have.property('bahrain');
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey],
        ).to.not.have.property('iraq');

        // Gulf War 2001 details filtered
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar2001.detailsKey],
        ).to.have.property('afghanistan');
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar2001.detailsKey],
        ).to.not.have.property('yemen');

        // Herbicide details filtered (checkbox false removes details)
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.detailsKey],
        ).to.have.property('vietnam');
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.detailsKey],
        ).to.not.have.property('cambodia');
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.detailsKey],
        ).to.deep.equal({
          vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
        });

        // Other exposures details filtered (checkbox false removes details)
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.detailsKey],
        ).to.have.property('asbestos');
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.detailsKey],
        ).to.not.have.property('radiation');
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.detailsKey],
        ).to.deep.equal({
          asbestos: { startDate: '1980-01-01', endDate: '1985-01-01' },
        });
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

      it('should preserve details when parent exposure object is missing (backend monitors orphans)', () => {
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

        expect(result.toxicExposure).to.have.property(
          EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey,
        );
        expect(result.toxicExposure).to.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.detailsKey,
        );
      });

      it('should preserve orphaned otherHerbicideLocations when sibling herbicide object is missing (backend monitors)', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            // No herbicide sibling object - orphaned but kept
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

        expect(result.toxicExposure).to.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.detailsKey,
        );
        expect(result.toxicExposure).to.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure).to.have.property(
          EXPOSURE_TYPE_MAPPING.otherExposures.detailsKey,
        );
        expect(result.toxicExposure).to.have.property('specifyOtherExposures');
      });

      it('should keep empty details object when all details are filtered out', () => {
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

        // Empty object kept - consistent with preserving null/undefined from form state
        // Backend handles empty objects same as null/undefined
        expect(result.toxicExposure).to.have.property(
          EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey,
        );
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey],
        ).to.deep.equal({});
        expect(result.toxicExposure.gulfWar1990).to.deep.equal({
          iraq: true,
          bahrain: false,
        });
      });

      it('should preserve herbicide section when herbicide.none is selected', () => {
        // herbicide has otherKey - only removed at conditions level, not when herbicide.none === true
        // User may have filled "other" text area without checking predefined boxes
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: {
              none: true,
              vietnam: true,
              cambodia: true,
            },
            otherHerbicideLocations: { description: 'Should be preserved' },
          },
        };

        const result = purgeToxicExposureData(formData);

        // herbicide is preserved because it has an "Other" free-text field where
        // users can enter custom locations even when checking "None of these"
        expect(result.toxicExposure).to.have.property('herbicide');
        expect(result.toxicExposure.herbicide).to.deep.equal({
          none: true,
          vietnam: true,
          cambodia: true,
        });
        expect(result.toxicExposure).to.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
        );
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.otherKey],
        ).to.deep.equal({ description: 'Should be preserved' });
      });

      it('should filter details to empty when all checkboxes false for all sections', () => {
        // All sections filter details based on checkbox state
        // When all checkboxes are false, details should be filtered to empty
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

        // gulfWar1990: Section preserved, details filtered to empty
        expect(result.toxicExposure).to.have.property('gulfWar1990');
        expect(result.toxicExposure.gulfWar1990).to.deep.equal({
          afghanistan: false,
          bahrain: false,
        });
        expect(result.toxicExposure).to.have.property(
          EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey,
        );
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey],
        ).to.deep.equal({});

        // herbicide: Section preserved, details filtered to empty
        expect(result.toxicExposure).to.have.property('herbicide');
        expect(result.toxicExposure.herbicide).to.deep.equal({
          vietnam: false,
          cambodia: false,
        });
        // herbicideDetails filtered to empty (all checkboxes false)
        expect(result.toxicExposure).to.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.detailsKey,
        );
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.detailsKey],
        ).to.deep.equal({});

        // otherHerbicideLocations preserved (has valid description)
        expect(result.toxicExposure).to.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
        );
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.otherKey],
        ).to.deep.equal({ description: 'Other location' });
      });

      it('should preserve invalid and falsy values but filter details for invalid parent', () => {
        // Invalid data types (non-objects) - parent kept, but details filtered
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
        // Invalid parent type kept
        expect(result.toxicExposure.gulfWar1990).to.equal('not-an-object');
        // Details filtered to empty (no matching keys in invalid parent), empty object kept
        expect(result.toxicExposure).to.have.property(
          EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey,
        );
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.gulfWar1990.detailsKey],
        ).to.deep.equal({});
        expect(result.toxicExposure.herbicide).to.deep.equal({ vietnam: true });

        // Null and undefined values - kept (no orphan cleanup)
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
        expect(result.toxicExposure).to.have.property('gulfWar1990');
        expect(result.toxicExposure.gulfWar1990).to.be.null;
        expect(result.toxicExposure).to.have.property('herbicide');
        expect(result.toxicExposure.herbicide).to.be.undefined;
        expect(result.toxicExposure.otherExposures.asbestos).to.equal(false);
        expect(result.toxicExposure.otherExposures.radiation).to.equal(true);
      });
    });

    describe('other fields cleanup (otherHerbicideLocations & specifyOtherExposures)', () => {
      it('should preserve valid descriptions when no parent exists, but remove whitespace-only values', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherHerbicideLocations: '   ',
            specifyOtherExposures: { description: 'Should be kept' },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
        );
        expect(result.toxicExposure).to.have.property(
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

      it('should preserve null/empty other fields when parent exists (backend validates)', () => {
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

        expect(result.toxicExposure).to.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
        );
        expect(result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.otherKey])
          .to.be.null;
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.otherKey],
        ).to.deep.equal({
          description: 'Asbestos exposure',
          startDate: '1980-01-01',
          endDate: '1985-12-31',
        });
      });

      it('should remove other fields with empty/whitespace descriptions (orphaned dates)', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: { vietnam: true },
            otherExposures: { asbestos: true },
            otherHerbicideLocations: {
              description: '',
              startDate: '1973-06-01',
              endDate: '1974-12-31',
            },
            specifyOtherExposures: {
              description: '   ',
              startDate: '1980-01-01',
              endDate: '1985-01-01',
            },
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

      it('should preserve other fields when set to undefined (backend validates)', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: { vietnam: true },
            otherExposures: { asbestos: true },
            otherHerbicideLocations: undefined,
            specifyOtherExposures: undefined,
          },
        };

        const result = purgeToxicExposureData(formData);
        expect(result.toxicExposure).to.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure.otherHerbicideLocations).to.be.undefined;
        expect(result.toxicExposure).to.have.property('specifyOtherExposures');
        expect(result.toxicExposure.specifyOtherExposures).to.be.undefined;
      });
    });

    describe('acceptance criteria - UX test cases', () => {
      it('should return unchanged when all conditions are false and no actual data (empty scaffolding)', () => {
        // All false values = no actual user-entered data, just empty form scaffolding
        // Return unchanged to avoid false positive "data purged" logging
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

        // No actual data = return unchanged (avoid false positive logging)
        expect(result).to.deep.equal(formData);
      });

      it('should preserve other fields and parent sections when all checkboxes are false (user did not select none)', () => {
        // Test: User has all checkboxes false but did NOT select 'none: true'
        // Since user didn't explicitly opt out, we keep all their data
        // This aligns with form flow where user can fill text area without checking boxes
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
              description:
                'Lead exposure from paint - user filled text area only',
              startDate: '2012-03-15',
              endDate: '2013-09-30',
            },
          },
        };
        const result1 = purgeToxicExposureData(exposuresData);
        // specifyOtherExposures preserved (user didn't select none)
        expect(result1.toxicExposure).to.have.property(
          EXPOSURE_TYPE_MAPPING.otherExposures.otherKey,
        );
        expect(
          result1.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.otherKey],
        ).to.deep.equal({
          description: 'Lead exposure from paint - user filled text area only',
          startDate: '2012-03-15',
          endDate: '2013-09-30',
        });
        // Parent section preserved (none !== true, no explicit opt-out)
        expect(result1.toxicExposure).to.have.property('otherExposures');
        expect(result1.toxicExposure.otherExposures).to.deep.equal({
          asbestos: false,
          chemical: false,
          radiation: false,
          other: false,
        });

        // Test: User filled otherHerbicideLocations text area but didn't check any checkboxes
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
              description: 'Thailand base camps - user filled text area only',
              startDate: '1973-06-01',
              endDate: '1974-12-31',
            },
          },
        };
        const result2 = purgeToxicExposureData(herbicideData);
        // otherHerbicideLocations preserved (user didn't select none)
        expect(result2.toxicExposure).to.have.property(
          EXPOSURE_TYPE_MAPPING.herbicide.otherKey,
        );
        expect(
          result2.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.otherKey],
        ).to.deep.equal({
          description: 'Thailand base camps - user filled text area only',
          startDate: '1973-06-01',
          endDate: '1974-12-31',
        });
        // Parent section preserved (none !== true, no explicit opt-out)
        expect(result2.toxicExposure).to.have.property('herbicide');
        expect(result2.toxicExposure.herbicide).to.deep.equal({
          cambodia: false,
          vietnam: false,
          thailand: false,
          none: false,
        });
      });
    });

    describe('data preservation - no orphan cleanup', () => {
      it('should preserve null exposure fields (no cleanup, backend monitors)', () => {
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

        // All null fields kept - no orphan cleanup
        expect(result.toxicExposure).to.have.property('gulfWar1990');
        expect(result.toxicExposure).to.have.property('gulfWar2001');
        expect(result.toxicExposure).to.have.property('herbicide');
        expect(result.toxicExposure).to.have.property('otherExposures');
        expect(result.toxicExposure).to.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure).to.have.property('specifyOtherExposures');
        expect(result.toxicExposure.conditions).to.deep.equal({ asthma: true });
      });

      it('should filter details for all sections based on checkbox state', () => {
        // All sections filter details based on checkbox state
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            gulfWar1990: { iraq: true },
            gulfWar1990Details: {
              iraq: { startDate: '1991-01-01' },
              kuwait: { startDate: '1991-02-01' }, // No parent selection - filtered
            },
            herbicideDetails: {
              vietnam: { startDate: '1968-01-01' }, // No parent herbicide object - kept (orphan)
            },
            otherExposures: { asbestos: true },
            otherExposuresDetails: {
              asbestos: { startDate: '1980-01-01' },
              radiation: { startDate: '1990-01-01' }, // checkbox false/undefined - filtered
            },
          },
        };

        const result = purgeToxicExposureData(formData);

        // gulfWar1990Details filtered based on parent selections
        expect(result.toxicExposure.gulfWar1990Details).to.deep.equal({
          iraq: { startDate: '1991-01-01' },
        });
        // Orphaned herbicideDetails kept - no orphan cleanup (no parent herbicide object)
        expect(result.toxicExposure).to.have.property('herbicideDetails');
        // otherExposuresDetails filtered based on checkbox state
        expect(result.toxicExposure.otherExposuresDetails).to.deep.equal({
          asbestos: { startDate: '1980-01-01' },
        });
      });

      it('should preserve orphaned details when parent exposures are undefined (no cleanup)', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            // Gulf War 1990 is undefined
            gulfWar1990Details: {
              iraq: { startDate: '1991-01-01' },
            },
            herbicideDetails: {
              vietnam: { startDate: '1968-01-01' },
            },
            otherHerbicideLocations: { description: 'Test' },
            otherExposuresDetails: {
              asbestos: { startDate: '1980-01-01' },
            },
            specifyOtherExposures: { description: 'Test' },
          },
        };

        const result = purgeToxicExposureData(formData);
        expect(result.toxicExposure).to.have.property('gulfWar1990Details');
        expect(result.toxicExposure).to.have.property('herbicideDetails');
        expect(result.toxicExposure).to.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure).to.have.property('otherExposuresDetails');
        expect(result.toxicExposure).to.have.property('specifyOtherExposures');
      });

      it('should remove gulfWar sections when none: true but preserve herbicide/otherExposures', () => {
        // Sections without otherKey (gulfWar1990, gulfWar2001): none: true triggers removal
        // Sections with otherKey (herbicide, otherExposures): preserved - only removed at conditions level
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            gulfWar1990: { none: true, iraq: true }, // none: true triggers removal (no otherKey)
            gulfWar2001: { none: true }, // none: true triggers removal (no otherKey)
            herbicide: { none: true, vietnam: true }, // preserved - has otherKey
            otherExposures: { none: true, asbestos: true }, // preserved - has otherKey
            otherHerbicideLocations: { description: 'Test' }, // preserved - herbicide has otherKey
            specifyOtherExposures: { description: 'Test' }, // preserved - otherExposures has otherKey
          },
        };

        const result = purgeToxicExposureData(formData);

        // Sections without otherKey removed when none: true
        expect(result.toxicExposure).to.not.have.property('gulfWar1990');
        expect(result.toxicExposure).to.not.have.property('gulfWar2001');

        // Sections with otherKey preserved (only removed at conditions level)
        expect(result.toxicExposure).to.have.property('herbicide');
        expect(result.toxicExposure.herbicide).to.deep.equal({
          none: true,
          vietnam: true,
        });
        expect(result.toxicExposure).to.have.property('otherExposures');
        expect(result.toxicExposure.otherExposures).to.deep.equal({
          none: true,
          asbestos: true,
        });

        // OtherKey fields preserved (parent sections have otherKey)
        expect(result.toxicExposure).to.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure.otherHerbicideLocations).to.deep.equal({
          description: 'Test',
        });
        expect(result.toxicExposure).to.have.property('specifyOtherExposures');
        expect(result.toxicExposure.specifyOtherExposures).to.deep.equal({
          description: 'Test',
        });

        // conditions remain
        expect(result.toxicExposure.conditions).to.deep.equal({ asthma: true });
      });

      it('should follow removal logic correctly - only none: true triggers section removal', () => {
        // Test: Only none: true triggers section removal, all false values are preserved
        // Details are filtered based on checkbox state for all sections
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true, // Flag enabled
          toxicExposure: {
            conditions: { asthma: true, cancer: false }, // Has valid conditions
            gulfWar1990: null,
            gulfWar2001: {
              // All false but no none: true - kept (not an explicit opt-out)
              afghanistan: false,
              yemen: false,
            },
            herbicide: {
              vietnam: true,
              cambodia: false,
            },
            herbicideDetails: {
              vietnam: { startDate: '1968-01-01' },
              cambodia: { startDate: '1969-01-01' },
              laos: { startDate: '1970-01-01' },
            },
            otherExposures: { asbestos: true },
            otherHerbicideLocations: null,
            specifyOtherExposures: { description: 'Valid' },
          },
        };

        const result = purgeToxicExposureData(formData);

        expect(result.toxicExposure).to.exist;
        expect(result.toxicExposure.conditions).to.deep.equal({
          asthma: true,
          cancer: false,
        }); // False values kept for backend visibility

        expect(result.toxicExposure).to.have.property('gulfWar1990');
        expect(result.toxicExposure.gulfWar1990).to.be.null;

        // gulfWar2001 is kept - all false is not an explicit opt-out (none !== true)
        expect(result.toxicExposure).to.have.property('gulfWar2001');
        expect(result.toxicExposure.gulfWar2001).to.deep.equal({
          afghanistan: false,
          yemen: false,
        });

        expect(result.toxicExposure.herbicide).to.deep.equal({
          vietnam: true,
          cambodia: false,
        }); // False values kept when mixed with true

        // herbicideDetails filtered based on checkbox state
        // Only vietnam is true, so only vietnam details kept
        expect(result.toxicExposure.herbicideDetails).to.deep.equal({
          vietnam: { startDate: '1968-01-01' },
        });

        expect(result.toxicExposure).to.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure.otherHerbicideLocations).to.be.null;
        expect(result.toxicExposure.specifyOtherExposures).to.deep.equal({
          description: 'Valid',
        });
      });
    });

    describe('edge cases', () => {
      it('should return unchanged for invalid types (no actual data to purge)', () => {
        const stringCase = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: 'not-an-object',
        };
        const arrayCase = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: [],
        };

        // Invalid types have no actual data - return unchanged (avoid false positive logging)
        expect(purgeToxicExposureData(stringCase)).to.deep.equal(stringCase);
        expect(purgeToxicExposureData(arrayCase)).to.deep.equal(arrayCase);
      });

      it('should keep only conditions when no conditions are selected (orphaned exposure data removed)', () => {
        // Empty conditions - keeps conditions, removes orphaned exposure data
        const emptyConditions = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: {},
            gulfWar1990: { bahrain: true },
          },
        };
        expect(
          purgeToxicExposureData(emptyConditions).toxicExposure,
        ).to.deep.equal({ conditions: {} });

        // Missing conditions - treats as empty conditions
        const missingConditions = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            gulfWar1990: { bahrain: true },
            herbicide: { vietnam: true },
          },
        };
        expect(
          purgeToxicExposureData(missingConditions).toxicExposure,
        ).to.deep.equal({ conditions: {} });

        // All false conditions - no conditions selected
        const falseConditions = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: false, cancer: false },
            gulfWar1990: { bahrain: true },
          },
        };
        expect(
          purgeToxicExposureData(falseConditions).toxicExposure,
        ).to.deep.equal({ conditions: { asthma: false, cancer: false } });
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

      it('should return unchanged when no meaningful conditions and no actual data (empty scaffolding)', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: {}, // Empty conditions
            gulfWar1990: {}, // Empty exposure data - no actual data
            herbicideDetails: {}, // Empty details - no actual data
            otherExposures: null, // Null - no actual data
            specifyOtherExposures: undefined, // Undefined - no actual data
          },
        };

        const result = purgeToxicExposureData(formData);

        // No actual data = return unchanged (avoid false positive logging)
        expect(result).to.deep.equal(formData);
      });
    });

    describe('integration tests', () => {
      it('should handle complex form data with mixed selections and preserve valid data', () => {
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
            otherHerbicideLocations: { description: '' }, // Empty description triggers removal
            specifyOtherExposures: '   ', // Whitespace-only triggers removal
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
        // herbicideDetails filtered based on checkbox state
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.herbicide.detailsKey],
        ).to.deep.equal({
          vietnam: { startDate: '1968-01-01', endDate: '1970-01-01' },
        });

        expect(result.toxicExposure.otherExposures).to.deep.equal({
          asbestos: true,
          radiation: false,
        });
        // otherExposuresDetails filtered based on checkbox state
        expect(
          result.toxicExposure[EXPOSURE_TYPE_MAPPING.otherExposures.detailsKey],
        ).to.deep.equal({
          asbestos: { startDate: '1980-01-01', endDate: '1985-01-01' },
        });

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

describe('purgeToxicExposureData - orphaned otherKey cleanup', () => {
  const orphanedCleanupTestCases = [
    {
      name: 'herbicide',
      exposureType: 'herbicide',
      otherKey: 'otherHerbicideLocations',
      dateFields: { startDate: '1973-06-01', endDate: '1974-12-31' },
    },
    {
      name: 'otherExposures',
      exposureType: 'otherExposures',
      otherKey: 'specifyOtherExposures',
      dateFields: { startDate: '2012-03-15', endDate: '2013-09-30' },
    },
  ];

  orphanedCleanupTestCases.forEach(
    ({ name, exposureType, otherKey, dateFields }) => {
      describe(`${name} orphaned cleanup`, () => {
        it(`should remove ${otherKey} when ${exposureType}.none === true and no description`, () => {
          const formData = {
            disability526ToxicExposureOptOutDataPurge: true,
            toxicExposure: {
              conditions: { asthma: true },
              [exposureType]: { none: true },
              [otherKey]: dateFields,
            },
          };

          const result = purgeToxicExposureData(formData);

          expect(result.toxicExposure).to.have.property(exposureType);
          expect(result.toxicExposure).to.not.have.property(otherKey);
        });

        it(`should preserve ${otherKey} when ${exposureType}.none === true and has description`, () => {
          const otherKeyData = {
            ...dateFields,
            description: 'Valid description',
          };
          const formData = {
            disability526ToxicExposureOptOutDataPurge: true,
            toxicExposure: {
              conditions: { asthma: true },
              [exposureType]: { none: true },
              [otherKey]: otherKeyData,
            },
          };

          const result = purgeToxicExposureData(formData);

          expect(result.toxicExposure).to.have.property(otherKey);
          expect(result.toxicExposure[otherKey]).to.deep.equal(otherKeyData);
        });

        it(`should remove ${otherKey} when it has only dates (orphaned - no description)`, () => {
          // Dates without description are orphaned and meaningless
          const formData = {
            disability526ToxicExposureOptOutDataPurge: true,
            toxicExposure: {
              conditions: { asthma: true },
              [exposureType]: { vietnam: false },
              [otherKey]: dateFields, // Only dates, no description = orphaned
            },
          };

          const result = purgeToxicExposureData(formData);

          // Orphaned dates removed regardless of none status
          expect(result.toxicExposure).to.not.have.property(otherKey);
        });
      });
    },
  );

  it('should handle empty description as no description', () => {
    const formData = {
      disability526ToxicExposureOptOutDataPurge: true,
      toxicExposure: {
        conditions: { asthma: true },
        herbicide: { none: true },
        otherHerbicideLocations: { description: '', startDate: '1973-06-01' },
      },
    };

    const result = purgeToxicExposureData(formData);

    expect(result.toxicExposure).to.not.have.property(
      'otherHerbicideLocations',
    );
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

  it('should preserve unknown/future fields in exposure selections and filter details based on checkbox state (forward compatibility)', () => {
    // This test ensures that when new exposure types are added to the constants
    // (e.g., new values in HERBICIDE_LOCATIONS or ADDITIONAL_EXPOSURES),
    // the purge logic preserves the selection fields and filters details based on checkbox state.
    // Note: all sections filter details based on checkbox state
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
          cambodia: { startDate: '1969-01-01', endDate: '1970-01-01' }, // filtered (checkbox false)
          futureLocation1: { startDate: '1975-01-01', endDate: '1976-01-01' }, // preserved (checkbox true)
          futureLocation2: { startDate: '1977-01-01', endDate: '1978-01-01' }, // filtered (checkbox false)
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
          radiation: { startDate: '1990-01-01', endDate: '1991-01-01' }, // filtered (checkbox false)
          futureExposure1: { startDate: '2000-01-01', endDate: '2001-01-01' }, // preserved (checkbox true)
          futureExposure2: { startDate: '2002-01-01', endDate: '2003-01-01' }, // filtered (checkbox false)
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

    // Herbicide details filtered based on checkbox state (only true selections preserved)
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

    // Other exposure details filtered based on checkbox state (only true selections preserved)
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

    // herbicide details filtered based on checkbox state (only true selections preserved)
    expect(result.toxicExposure).to.have.property('herbicideDetails');
    expect(result.toxicExposure.herbicideDetails).to.have.property('vietnam');
    expect(result.toxicExposure.herbicideDetails).to.have.property('laos');
    expect(result.toxicExposure.herbicideDetails).to.have.property('thailand');
    expect(result.toxicExposure.herbicideDetails).to.not.have.property(
      'cambodia',
    ); // checkbox false - filtered

    expect(result.toxicExposure).to.have.property('otherExposures');
    expect(result.toxicExposure.otherExposures.asbestos).to.be.true;
    expect(result.toxicExposure.otherExposures.chemical).to.be.false;
    expect(result.toxicExposure.otherExposures.depleted).to.be.true;
    expect(result.toxicExposure.otherExposures.radiation).to.be.true;
    expect(result.toxicExposure.otherExposures.shipyard).to.be.true;
    expect(result.toxicExposure.otherExposures.other).to.be.true;

    // otherExposures details filtered based on checkbox state (only true selections preserved)
    expect(result.toxicExposure).to.have.property('otherExposuresDetails');
    expect(result.toxicExposure.otherExposuresDetails).to.have.property(
      'asbestos',
    );
    expect(result.toxicExposure.otherExposuresDetails).to.not.have.property(
      'chemical',
    ); // checkbox false - filtered
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
