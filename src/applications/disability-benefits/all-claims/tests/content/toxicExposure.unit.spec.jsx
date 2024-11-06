import { expect } from 'chai';
import sinon from 'sinon';
import {
  datesDescription,
  getKeyIndex,
  getOtherFieldDescription,
  getSelectedCount,
  isClaimingTECondition,
  makeTEConditionsSchema,
  makeTEConditionsUISchema,
  showCheckboxLoopDetailsPage,
  showSummaryPage,
  showToxicExposurePages,
  validateTEConditions,
} from '../../content/toxicExposure';

describe('toxicExposure', () => {
  let formData;

  describe('showToxicExposurePages', () => {
    describe('startedFormVersion is 2019', () => {
      it('returns true when claiming one or more new conditions', () => {
        formData = {
          startedFormVersion: '2019',
          'view:claimType': {
            'view:claimingIncrease': false,
            'view:claimingNew': true,
          },
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
          ],
        };

        expect(showToxicExposurePages(formData)).to.be.true;
      });

      it('returns false when claim type is CFI only', () => {
        formData = {
          startedFormVersion: '2019',
          'view:claimType': {
            'view:claimingIncrease': true,
            'view:claimingNew': false,
          },
        };

        expect(showToxicExposurePages(formData)).to.be.false;
      });

      it('returns true when both claim types', () => {
        formData = {
          startedFormVersion: '2019',
          'view:claimType': {
            'view:claimingIncrease': true,
            'view:claimingNew': true,
          },
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
          ],
        };

        expect(showToxicExposurePages(formData)).to.be.true;
      });
    });

    describe('startedFormVersion is 2022', () => {
      it('returns true when claiming one or more new conditions', () => {
        formData = {
          startedFormVersion: '2022',
          'view:claimType': {
            'view:claimingIncrease': false,
            'view:claimingNew': true,
          },
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              condition: 'asthma',
              'view:descriptionInfo': {},
            },
            {
              cause: 'SECONDARY',
              'view:secondaryFollowUp': {
                causedByDisability: 'Diabetes Mellitus0',
                causedByDisabilityDescription: 'Test description 2',
              },
              condition:
                'Cranial nerve paralysis or cranial neuritis (inflammation of cranial nerves)',
              'view:descriptionInfo': {},
            },
          ],
        };

        expect(showToxicExposurePages(formData)).to.be.true;
      });

      it('returns false when claim type is CFI only', () => {
        formData = {
          startedFormVersion: '2022',
          'view:claimType': {
            'view:claimingIncrease': true,
            'view:claimingNew': false,
          },
        };

        expect(showToxicExposurePages(formData)).to.be.false;
      });

      it('returns true when both claim types', () => {
        formData = {
          startedFormVersion: '2022',
          'view:claimType': {
            'view:claimingIncrease': true,
            'view:claimingNew': true,
          },
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
            {
              cause: 'WORSENED',
              'view:worsenedFollowUp': {
                worsenedDescription: 'My knee was strained in the service',
                worsenedEffects:
                  "It wasn't great before, but it got bad enough I needed a replacement. Now I have to take medication for it.",
              },
              condition: 'ankylosis in knee, bilateral',
              'view:descriptionInfo': {},
            },
          ],
        };

        expect(showToxicExposurePages(formData)).to.be.true;
      });
    });
  });

  describe('isClaimingTECondition', () => {
    beforeEach(() => {
      formData = {
        startedFormVersion: '2022',
      };
    });

    it('returns true when claiming new, one condition selected', () => {
      formData = {
        ...formData,
        'view:claimType': {
          'view:claimingIncrease': false,
          'view:claimingNew': true,
        },
        newDisabilities: [
          {
            cause: 'NEW',
            primaryDescription: 'Test description',
            'view:serviceConnectedDisability': {},
            condition: 'Tinnitus',
          },
          {
            cause: 'NEW',
            primaryDescription: 'Test description2',
            'view:serviceConnectedDisability': {},
            condition: 'Anemia',
          },
        ],
        toxicExposure: {
          conditions: {
            tinnitus: true,
            anemia: false,
            none: false,
          },
        },
      };

      expect(isClaimingTECondition(formData)).to.be.true;
    });

    it('returns false when not claiming new', () => {
      formData = {
        ...formData,
        'view:claimType': {
          'view:claimingIncrease': true,
          'view:claimingNew': false,
        },
      };

      expect(isClaimingTECondition(formData)).to.be.false;
    });

    it('returns false when claiming new, no conditions selected', () => {
      formData = {
        ...formData,
        'view:claimType': {
          'view:claimingIncrease': false,
          'view:claimingNew': true,
        },
        toxicExposure: {
          conditions: {
            tinnitus: false,
            anemia: false,
            none: false,
          },
        },
      };

      expect(isClaimingTECondition(formData)).to.be.false;
    });

    it('returns false when selected none checkbox', () => {
      formData = {
        ...formData,
        'view:claimType': {
          'view:claimingIncrease': false,
          'view:claimingNew': true,
        },
        toxicExposure: {
          conditions: {
            tinnitus: false,
            anemia: false,
            none: true,
          },
        },
      };

      expect(isClaimingTECondition(formData)).to.be.false;
    });
  });

  describe('makeTEConditionsSchema', () => {
    it('creates schema for toxic exposure conditions', () => {
      formData = {
        newDisabilities: [
          {
            cause: 'NEW',
            primaryDescription: 'Test description',
            'view:serviceConnectedDisability': {},
            condition: 'anemia',
          },
          {
            cause: 'NEW',
            primaryDescription: 'Test description',
            'view:serviceConnectedDisability': {},
            condition: 'tinnitus (ringing or hissing in ears)',
          },
        ],
      };

      expect(makeTEConditionsSchema(formData)).to.eql({
        type: 'object',
        properties: {
          anemia: {
            type: 'boolean',
          },
          tinnitusringingorhissinginears: {
            type: 'boolean',
          },
          none: {
            type: 'boolean',
          },
        },
      });
    });
  });

  describe('makeTEConditionsUISchema', () => {
    it('creates ui schema for toxic exposure conditions', () => {
      formData = {
        newDisabilities: [
          {
            cause: 'NEW',
            primaryDescription: 'Test description',
            'view:serviceConnectedDisability': {},
            condition: 'anemia',
          },
          {
            cause: 'NEW',
            primaryDescription: 'Test description',
            'view:serviceConnectedDisability': {},
            condition: 'tinnitus (ringing or hissing in ears)',
          },
        ],
      };

      expect(makeTEConditionsUISchema(formData)).to.eql({
        anemia: {
          'ui:title': 'Anemia',
        },
        tinnitusringingorhissinginears: {
          'ui:title': 'Tinnitus (Ringing Or Hissing In Ears)',
        },
        none: {
          'ui:title':
            'I am not claiming any conditions related to toxic exposure',
        },
      });
    });

    it('handles null condition', () => {
      formData = {
        newDisabilities: [
          {
            cause: 'NEW',
            primaryDescription: 'test',
            'view:serviceConnectedDisability': {},
          },
        ],
      };

      expect(makeTEConditionsUISchema(formData)).to.eql({
        unknowncondition: {
          'ui:title': 'Unknown Condition',
        },
        none: {
          'ui:title':
            'I am not claiming any conditions related to toxic exposure',
        },
      });
    });
  });

  describe('validateTEConditions', () => {
    it('should add error when selecting none and a condition', () => {
      const errors = {
        toxicExposure: {
          conditions: {
            addError: sinon.spy(),
          },
        },
      };

      formData = {
        toxicExposure: {
          conditions: {
            anemia: true,
            tinnitusringingorhissinginears: false,
            none: true,
          },
        },
      };

      validateTEConditions(errors, formData);
      expect(errors.toxicExposure.conditions.addError.called).to.be.true;
    });

    it('should not add error when selecting conditions', () => {
      const errors = {
        toxicExposure: {
          conditions: {
            addError: sinon.spy(),
          },
        },
      };

      formData = {
        toxicExposure: {
          conditions: {
            anemia: true,
            tinnitusringingorhissinginears: true,
            none: false,
          },
        },
      };

      validateTEConditions(errors, formData);
      expect(errors.toxicExposure.conditions.addError.called).to.be.false;
    });
  });

  describe('getKeyIndex', () => {
    it('finds and returns the index', () => {
      formData = {
        toxicExposure: {
          gulfWar1990: {
            bahrain: true,
            egypt: false,
            airspace: true,
          },
        },
      };

      expect(getKeyIndex('bahrain', 'gulfWar1990', formData)).to.equal(1);
      expect(getKeyIndex('airspace', 'gulfWar1990', formData)).to.equal(2);
    });

    it('returns 0 when location data not available', () => {
      formData = {
        toxicExposure: {},
      };

      expect(getKeyIndex('bahrain', 'gulfWar1990', {})).to.equal(0);
      expect(getKeyIndex('bahrain', 'gulfWar1990', formData)).to.equal(0);
    });

    it('returns 0 when location not selected', () => {
      formData = {
        toxicExposure: {
          gulfWar1990: {
            egypt: false,
          },
        },
      };

      expect(getKeyIndex('egypt', 'gulfWar1990', formData)).to.equal(0);
      expect(getKeyIndex('bahrain', 'gulfWar1990', formData)).to.equal(0);
    });
  });

  describe('getSelectedCount', () => {
    it('gets the count with a mix of selected and deselected items', () => {
      formData = {
        toxicExposure: {
          gulfWar1990: {
            bahrain: true,
            egypt: false,
            airspace: true,
          },
        },
      };

      expect(getSelectedCount('gulfWar1990', formData)).to.be.equal(2);
    });

    it('gets 0 count when no items selected', () => {
      formData = {
        toxicExposure: {
          gulfWar1990: {
            bahrain: false,
            egypt: false,
            airspace: false,
          },
        },
      };

      expect(getSelectedCount('gulfWar1990', formData)).to.be.equal(0);
    });

    it('gets 0 count when no checkbox values', () => {
      formData = {
        toxicExposure: {
          gulfWar1990: {},
        },
      };

      expect(getSelectedCount('gulfWar1990', formData)).to.be.equal(0);
    });

    it('gets 0 count when no checkbox object not found', () => {
      formData = {};

      expect(getSelectedCount('gulfWar1990', formData)).to.be.equal(0);
    });

    it('gets 0 count when no form data', () => {
      expect(getSelectedCount('gulfWar1990', undefined)).to.be.equal(0);
    });

    it('gets the count with a mix of selected and deselected items and other description', () => {
      formData = {
        toxicExposure: {
          herbicide: {
            cambodia: true,
            koreandemilitarizedzone: true,
            laos: true,
            vietnam: false,
          },
          otherHerbicideLocations: {
            startDate: '1968-01-01',
            endDate: '1969-01-01',
            description: 'location 1, location 2',
          },
        },
      };

      expect(
        getSelectedCount('herbicide', formData, 'otherHerbicideLocations'),
      ).to.be.equal(4);
    });

    it('gets the count with other description only', () => {
      formData = {
        toxicExposure: {
          herbicide: {},
          otherHerbicideLocations: {
            description: 'location 1, location 2',
          },
        },
      };

      expect(
        getSelectedCount('herbicide', formData, 'otherHerbicideLocations'),
      ).to.be.equal(1);
    });

    it('gets 0 count when `notsure` location is selected', () => {
      formData = {
        toxicExposure: {
          gulfWar1990: {
            notsure: true,
          },
        },
      };

      expect(getSelectedCount('gulfWar1990', { formData })).to.be.equal(0);
    });
  });

  describe('showCheckboxLoopDetailsPage', () => {
    describe('toxic exposure not enabled', () => {
      beforeEach(() => {
        formData = {};
      });

      it('should return false', () => {
        formData = {
          ...formData,
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
          ],
          toxicExposure: {
            conditions: {
              anemia: true,
            },
            gulfWar1990: {
              bahrain: true,
              egypt: false,
              airspace: true,
            },
          },
        };

        expect(showCheckboxLoopDetailsPage(formData, 'gulfWar1990', 'bahrain'))
          .to.be.false;
      });
    });

    describe('toxic exposure is enabled', () => {
      beforeEach(() => {
        formData = {
          startedFormVersion: '2022',
        };
      });

      it('should return false when no new disabilities', () => {
        formData = {
          ...formData,
          newDisabilities: [],
        };

        expect(showCheckboxLoopDetailsPage(formData, 'gulfWar1990', 'bahrain'))
          .to.be.false;
      });

      it('should return false when claiming new disability, but no selected locations', () => {
        formData = {
          ...formData,
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
          ],
          toxicExposure: {
            conditions: {
              anemia: true,
            },
            gulfWar1990: {
              bahrain: false,
              airspace: false,
            },
          },
        };

        expect(showCheckboxLoopDetailsPage(formData, 'gulfWar1990', 'bahrain'))
          .to.be.false;
        expect(showCheckboxLoopDetailsPage(formData, 'gulfWar1990', 'egypt')).to
          .be.false;
        expect(showCheckboxLoopDetailsPage(formData, 'gulfWar1990', 'airspace'))
          .to.be.false;
      });

      it('should return true when all criteria met', () => {
        formData = {
          ...formData,
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
          ],
          toxicExposure: {
            conditions: {
              anemia: true,
            },
            gulfWar1990: {
              bahrain: true,
              egypt: false,
              airspace: true,
            },
          },
        };
        expect(showCheckboxLoopDetailsPage(formData, 'gulfWar1990', 'bahrain'))
          .to.be.true;
      });

      it('should return false when `none` location is selected', () => {
        formData = {
          ...formData,
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
          ],
          toxicExposure: {
            conditions: {
              anemia: true,
            },
            gulfWar1990: {
              none: true,
            },
            gulfWar2001: {
              none: true,
            },
          },
        };

        expect(showCheckboxLoopDetailsPage(formData, 'gulfWar1990', 'none')).to
          .be.false;
        expect(showCheckboxLoopDetailsPage(formData, 'gulfWar2001', 'none')).to
          .be.false;
      });

      it('should return false when `none` and another location is selected', () => {
        formData = {
          ...formData,
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
          ],
          toxicExposure: {
            conditions: {
              anemia: true,
            },
            gulfWar1990: {
              afghanistan: true,
              none: true,
            },
            gulfWar2001: {
              yemen: true,
              none: true,
            },
          },
        };

        expect(
          showCheckboxLoopDetailsPage(formData, 'gulfWar1990', 'afghanistan'),
        ).to.be.false;
        expect(showCheckboxLoopDetailsPage(formData, 'gulfWar2001', 'yemen')).to
          .be.false;
      });

      it('should return false when `notsure` location is selected', () => {
        formData = {
          ...formData,
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
          ],
          toxicExposure: {
            conditions: {
              anemia: true,
            },
            gulfWar1990: {
              notsure: true,
            },
            gulfWar2001: {
              notsure: true,
            },
          },
        };

        expect(showCheckboxLoopDetailsPage(formData, 'gulfWar1990', 'notsure'))
          .to.be.false;
        expect(showCheckboxLoopDetailsPage(formData, 'gulfWar2001', 'notsure'))
          .to.be.false;
      });
    });
  });

  describe('showSummaryPage', () => {
    describe('toxic exposure is not enabled', () => {
      beforeEach(() => {
        formData = {};
      });

      it('should return false', () => {
        formData = {
          ...formData,
          gulfWar1990: {
            bahrain: true,
            egypt: false,
            airspace: true,
          },
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
          ],
          toxicExposure: {
            conditions: {
              anemia: true,
            },
          },
        };

        expect(showSummaryPage(formData, 'gulfWar1990')).to.be.false;
      });
    });

    describe('toxic exposure is enabled', () => {
      beforeEach(() => {
        formData = {
          startedFormVersion: '2022',
        };
      });

      it('should return false when no new disabilities', () => {
        formData = {
          ...formData,
          newDisabilities: [],
        };

        expect(showSummaryPage(formData, 'gulfWar1990')).to.be.false;
      });

      it('should return false when claiming new disability, but no selected locations', () => {
        formData = {
          ...formData,
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
          ],
          toxicExposure: {
            conditions: {
              anemia: true,
            },
            gulfWar1990: {
              bahrain: false,
              airspace: false,
            },
          },
        };

        expect(showSummaryPage(formData, 'gulfWar1990')).to.be.false;
      });

      it('should return true when all criteria met', () => {
        formData = {
          ...formData,
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
          ],
          toxicExposure: {
            conditions: {
              anemia: true,
            },
            gulfWar1990: {
              bahrain: true,
              egypt: false,
              airspace: true,
            },
          },
        };

        expect(showSummaryPage(formData, 'gulfWar1990')).to.be.true;
      });

      it('should return false when `none` location is selected', () => {
        formData = {
          ...formData,
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
          ],
          toxicExposure: {
            conditions: {
              anemia: true,
            },
            gulfWar1990: {
              none: true,
            },
            gulfWar2001: {
              none: true,
            },
          },
        };

        expect(showSummaryPage(formData, 'gulfWar1990')).to.be.false;
        expect(showSummaryPage(formData, 'gulfWar2001')).to.be.false;
      });

      it('should return false when `none` and another location are selected', () => {
        formData = {
          ...formData,
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
          ],
          toxicExposure: {
            conditions: {
              anemia: true,
            },
            gulfWar1990: {
              afghanistan: true,
              none: true,
            },
            gulfWar2001: {
              yemen: true,
              none: true,
            },
          },
        };

        expect(showSummaryPage(formData, 'gulfWar1990')).to.be.false;
        expect(showSummaryPage(formData, 'gulfWar2001')).to.be.false;
      });

      it('should return false when `notsure` location is selected', () => {
        formData = {
          ...formData,
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
          ],
          toxicExposure: {
            conditions: {
              anemia: true,
            },
            gulfWar1990: {
              notsure: true,
            },
            gulfWar2001: {
              notsure: true,
            },
          },
        };

        expect(showSummaryPage(formData, 'gulfWar1990')).to.be.false;
        expect(showSummaryPage(formData, 'gulfWar2001')).to.be.false;
      });

      it('should return true when `notsure` and another location are selected', () => {
        formData = {
          ...formData,
          newDisabilities: [
            {
              cause: 'NEW',
              primaryDescription: 'Test description',
              'view:serviceConnectedDisability': {},
              condition: 'anemia',
            },
          ],
          toxicExposure: {
            conditions: {
              anemia: true,
            },
            gulfWar1990: {
              afghanistan: true,
              notsure: true,
            },
            gulfWar2001: {
              yemen: true,
              notsure: true,
            },
          },
        };

        expect(showSummaryPage(formData, 'gulfWar1990')).to.be.true;
        expect(showSummaryPage(formData, 'gulfWar2001')).to.be.true;
      });
    });
  });

  describe('datesDescription', () => {
    it('build the no dates description when no dates are provided', () => {
      expect(datesDescription({})).to.equal('No dates entered');
    });

    it('build the no dates description when empty dates are provided', () => {
      const dates = {
        startDate: '',
        endDate: '',
      };

      expect(datesDescription(dates)).to.equal('No dates entered');
    });

    it('build the description with both dates when both dates are provided', () => {
      const dates = {
        startDate: '2020-01-01',
        endDate: '2022-01-05',
      };

      expect(datesDescription(dates)).to.equal('January 2020 - January 2022');
    });

    it('builds the description with end date only', () => {
      const dates = {
        endDate: '2022-01-05',
      };

      expect(datesDescription(dates)).to.equal(
        'No start date entered - January 2022',
      );
    });

    it('builds the description with start date only', () => {
      const dates = {
        startDate: '2022-01-05',
      };

      expect(datesDescription(dates)).to.equal(
        'January 2022 - No end date entered',
      );
    });
  });

  describe('getOtherFieldDescription', () => {
    it('gets the trimmed value', () => {
      formData = {
        toxicExposure: {
          otherHerbicideLocations: {
            startDate: '1968-01-01',
            endDate: '1969-01-01',
            description: ' location 1, location 2   ',
          },
        },
      };
      expect(
        getOtherFieldDescription(formData, 'otherHerbicideLocations'),
      ).to.equal('location 1, location 2');
    });
  });
});
