import { expect } from 'chai';
import {
  cleanToxicExposureData,
  getAllToxicExposureKeys,
} from '../../../utils/on-submit';

describe('cleanToxicExposureData', () => {
  describe('when feature flag is disabled', () => {
    it('should not clean when flag is false', () => {
      const formData = {
        disability526ToxicExposureOptOutDataPurge: false,
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: { bahrain: true },
        },
      };

      const result = cleanToxicExposureData(formData);
      expect(result).to.deep.equal(formData);
    });

    it('should not clean when flag is undefined', () => {
      const formData = {
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: { bahrain: true },
        },
      };

      const result = cleanToxicExposureData(formData);
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

        const result = cleanToxicExposureData(formData);
        expect(result).to.deep.equal(formData);
      });

      it('should remove empty toxicExposure object', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: {},
            gulfWar1990: {},
            herbicide: null,
          },
        };

        const result = cleanToxicExposureData(formData);
        expect(result).to.not.have.property('toxicExposure');
      });
    });

    describe('with "none" condition selected', () => {
      it('should keep only none condition when selected alone', () => {
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

        const result = cleanToxicExposureData(formData);

        expect(result.toxicExposure).to.deep.equal({
          conditions: { none: true },
        });
        expect(Object.keys(result.toxicExposure)).to.have.lengthOf(1);
      });

      it('should preserve other form data when cleaning toxic exposure', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          newDisabilities: [{ condition: 'Chronic Bronchitis' }],
          veteranInformation: { name: 'John Doe' },
          toxicExposure: {
            conditions: { none: true },
            gulfWar1990: { bahrain: true },
          },
        };

        const result = cleanToxicExposureData(formData);

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
      it('should keep all data when conditions selected', () => {
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

        const result = cleanToxicExposureData(formData);

        expect(result.toxicExposure.conditions).to.deep.equal({
          asthma: true,
          cancer: true,
        });
        expect(result.toxicExposure.gulfWar1990).to.exist;
        expect(result.toxicExposure.gulfWar1990Details).to.exist;
      });

      it('should remove false conditions', () => {
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

        const result = cleanToxicExposureData(formData);

        expect(result.toxicExposure.conditions).to.deep.equal({
          asthma: true,
          cancer: true,
        });
      });
    });

    describe('cleaning exposure details', () => {
      it('should remove details for unselected locations across all exposure types', () => {
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

        const result = cleanToxicExposureData(formData);

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

      it('should keep false values in main objects while removing their details', () => {
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

        const result = cleanToxicExposureData(formData);

        expect(result.toxicExposure.gulfWar1990).to.deep.equal({
          afghanistan: true,
          bahrain: false,
          iraq: false,
        });

        expect(result.toxicExposure.gulfWar1990Details).to.deep.equal({
          afghanistan: { startDate: '2001-10-01' },
        });
      });

      it('should remove orphaned details when main selection missing', () => {
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

        const result = cleanToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property('gulfWar1990Details');
        expect(result.toxicExposure).to.not.have.property('herbicideDetails');
      });

      it('should remove entire exposure section when all values are false', () => {
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

        const result = cleanToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property('gulfWar1990');
        expect(result.toxicExposure).to.not.have.property('gulfWar1990Details');
      });

      it('should remove otherHerbicideLocations when herbicide.none is true', () => {
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

        const result = cleanToxicExposureData(formData);

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

        const result = cleanToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property('herbicide');
        expect(result.toxicExposure).to.not.have.property('herbicideDetails');
        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
      });

      it('should handle details with non-plain object inputs', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            gulfWar1990: { bahrain: true },
            gulfWar1990Details: 'not-an-object',
          },
        };

        const result = cleanToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property('gulfWar1990Details');
        expect(result.toxicExposure.gulfWar1990).to.exist;
      });

      it('should handle selections as non-plain object', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            gulfWar1990: 'not-an-object',
            gulfWar1990Details: {
              bahrain: { startDate: '1990-01-01' },
            },
          },
        };

        const result = cleanToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property('gulfWar1990Details');
      });

      it('should handle conditions as non-plain object', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: 'not-an-object',
            gulfWar1990: { bahrain: true },
          },
        };

        const result = cleanToxicExposureData(formData);

        expect(result.toxicExposure.conditions).to.deep.equal({});
        expect(result.toxicExposure.gulfWar1990).to.exist;
      });

      it('should remove null values but preserve false values', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherHerbicideLocations: null,
            specifyOtherExposures: false,
          },
        };

        const result = cleanToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure).to.have.property('specifyOtherExposures');
        expect(result.toxicExposure.specifyOtherExposures).to.equal(false);
      });
    });

    describe('cleaning text fields', () => {
      it('should remove null values but preserve undefined values', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherHerbicideLocations: null,
            specifyOtherExposures: undefined,
          },
        };

        const result = cleanToxicExposureData(formData);
        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure).to.have.property('specifyOtherExposures');
        expect(result.toxicExposure.specifyOtherExposures).to.be.undefined;
      });

      it('should remove text fields with whitespace-only descriptions', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherHerbicideLocations: '   ',
            specifyOtherExposures: { description: '   ' },
          },
        };

        const result = cleanToxicExposureData(formData);

        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure).to.not.have.property(
          'specifyOtherExposures',
        );
      });

      it('should handle zero and empty array for text fields', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherHerbicideLocations: 0,
            specifyOtherExposures: [],
          },
        };

        const result = cleanToxicExposureData(formData);

        expect(result.toxicExposure).to.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure.otherHerbicideLocations).to.equal(0);
        expect(result.toxicExposure).to.not.have.property(
          'specifyOtherExposures',
        );
      });

      it('should remove empty otherHerbicideLocations', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherHerbicideLocations: { description: '   ' },
          },
        };

        const result = cleanToxicExposureData(formData);
        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
      });

      it('should keep otherHerbicideLocations with content', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherHerbicideLocations: { description: 'Thailand base camps' },
          },
        };

        const result = cleanToxicExposureData(formData);
        expect(result.toxicExposure.otherHerbicideLocations).to.deep.equal({
          description: 'Thailand base camps',
        });
      });

      it('should handle string format for otherHerbicideLocations', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherHerbicideLocations: 'Thailand base camps',
          },
        };

        const result = cleanToxicExposureData(formData);
        expect(result.toxicExposure.otherHerbicideLocations).to.equal(
          'Thailand base camps',
        );
      });

      it('should remove empty specifyOtherExposures', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
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

      it('should keep specifyOtherExposures with content', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
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

      it('should handle object format for specifyOtherExposures', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
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
    });

    describe('edge cases', () => {
      it('should handle non-plain object toxic exposure', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: 'not-an-object',
        };

        const result = cleanToxicExposureData(formData);
        expect(result).to.deep.equal(formData);
      });

      it('should handle toxic exposure as array', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: [],
        };

        const result = cleanToxicExposureData(formData);
        expect(result).to.deep.equal(formData);
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

        const result = cleanToxicExposureData(formData);

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

        const result = cleanToxicExposureData(formData);

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

        const result = cleanToxicExposureData(formData);

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
        cleanToxicExposureData(originalFormData);

        expect(originalFormData).to.deep.equal(formDataCopy);
      });

      it('should remove null values due to cloneDeep transformation', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: { vietnam: true },
            otherHerbicideLocations: null,
          },
        };

        const result = cleanToxicExposureData(formData);
        expect(result.toxicExposure).to.not.have.property(
          'otherHerbicideLocations',
        );
      });

      it('should preserve specifyOtherExposures with undefined value', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherExposures: { asbestos: true },
            specifyOtherExposures: undefined,
          },
        };

        const result = cleanToxicExposureData(formData);
        expect(result.toxicExposure).to.have.property('specifyOtherExposures');
        expect(result.toxicExposure.specifyOtherExposures).to.be.undefined;
      });

      it('should preserve otherHerbicideLocations with false value', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            herbicide: { vietnam: true },
            otherHerbicideLocations: false,
          },
        };

        const result = cleanToxicExposureData(formData);
        expect(result.toxicExposure).to.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure.otherHerbicideLocations).to.equal(false);
      });

      it('should preserve numeric zero values', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherHerbicideLocations: 0,
            specifyOtherExposures: 0,
          },
        };

        const result = cleanToxicExposureData(formData);
        expect(result.toxicExposure).to.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure.otherHerbicideLocations).to.equal(0);
        expect(result.toxicExposure).to.have.property('specifyOtherExposures');
        expect(result.toxicExposure.specifyOtherExposures).to.equal(0);
      });

      it('should preserve empty string values', () => {
        const formData = {
          disability526ToxicExposureOptOutDataPurge: true,
          toxicExposure: {
            conditions: { asthma: true },
            otherHerbicideLocations: '',
            specifyOtherExposures: '',
          },
        };

        const result = cleanToxicExposureData(formData);
        expect(result.toxicExposure).to.have.property(
          'otherHerbicideLocations',
        );
        expect(result.toxicExposure.otherHerbicideLocations).to.equal('');
        expect(result.toxicExposure).to.have.property('specifyOtherExposures');
        expect(result.toxicExposure.specifyOtherExposures).to.equal('');
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

        const result = cleanToxicExposureData(formData);

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
