import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  dateHelp,
  dateRangePageDescription,
  datesDescription,
  getKeyIndex,
  getSelectedCount,
  isClaimingTECondition,
  makeTEConditionsSchema,
  makeTEConditionsUISchema,
  showGulfWar1990DetailsPage,
  showGulfWar1990SummaryPage,
  showToxicExposurePages,
  validateTEConditions,
} from '../../content/toxicExposure';
import { SHOW_TOXIC_EXPOSURE } from '../../constants';

describe('toxicExposure', () => {
  afterEach(() => {
    window.sessionStorage.removeItem(SHOW_TOXIC_EXPOSURE);
  });

  describe('showToxicExposurePages', () => {
    describe('toggle disabled', () => {
      it('returns false when claim type is new', () => {
        const formData = {
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

        expect(showToxicExposurePages(formData)).to.be.false;
      });

      it('returns false when claim type is CFI', () => {
        const formData = {
          'view:claimType': {
            'view:claimingIncrease': true,
            'view:claimingNew': false,
          },
        };

        expect(showToxicExposurePages(formData)).to.be.false;
      });

      it('returns false when using both claim types', () => {
        const formData = {
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

        expect(showToxicExposurePages(formData)).to.be.false;
      });
    });

    describe('toggle enabled', () => {
      beforeEach(() => {
        window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, 'true');
      });

      it('returns true when claiming one or more new conditions', () => {
        const formData = {
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

      it('returns false when claim type is CFI', () => {
        const formData = {
          'view:claimType': {
            'view:claimingIncrease': true,
            'view:claimingNew': false,
          },
        };

        expect(showToxicExposurePages(formData)).to.be.false;
      });

      it('returns true when both claim types', () => {
        const formData = {
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
  });

  describe('isClaimingTECondition', () => {
    beforeEach(() => {
      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, 'true');
    });

    it('returns true when claiming new, one condition selected', () => {
      const formData = {
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
      const formData = {
        'view:claimType': {
          'view:claimingIncrease': true,
          'view:claimingNew': false,
        },
      };

      expect(isClaimingTECondition(formData)).to.be.false;
    });

    it('returns false when claiming new, no conditions selected', () => {
      const formData = {
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
      const formData = {
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
      const formData = {
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
      const formData = {
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
      const formData = {
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

      const formData = {
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

      const formData = {
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

  describe('dateRangePageDescription', () => {
    it('displays description when counts specified', () => {
      const tree = render(dateRangePageDescription(1, 5, 'Egypt'));
      tree.getByText('1 of 5: Egypt', { exact: false });
      tree.getByText(dateHelp);
    });

    it('displays description when counts not specified', () => {
      const tree = render(dateRangePageDescription(0, 0, 'Egypt'));
      tree.getByText('Egypt');
      tree.getByText(dateHelp);
    });
  });

  describe('getKeyIndex', () => {
    it('finds and returns the index', () => {
      const formData = {
        toxicExposure: {
          gulfWar1990: {
            bahrain: true,
            egypt: false,
            airspace: true,
          },
        },
      };

      expect(getKeyIndex('bahrain', 'gulfWar1990', { formData })).to.equal(1);
      expect(getKeyIndex('airspace', 'gulfWar1990', { formData })).to.equal(2);
    });

    it('returns 0 when location data not available', () => {
      const formData = {
        toxicExposure: {},
      };

      expect(getKeyIndex('bahrain', 'gulfWar1990', {})).to.equal(0);
      expect(getKeyIndex('bahrain', 'gulfWar1990', formData)).to.equal(0);
    });

    it('returns 0 when location not selected', () => {
      const formData = {
        toxicExposure: {
          gulfWar1990: {
            egypt: false,
          },
        },
      };

      expect(getKeyIndex('egypt', 'gulfWar1990', { formData })).to.equal(0);
      expect(getKeyIndex('bahrain', 'gulfWar1990', { formData })).to.equal(0);
    });
  });

  describe('getSelectedCount', () => {
    it('gets the count with a mix of selected and deselected items', () => {
      const formData = {
        toxicExposure: {
          gulfWar1990: {
            bahrain: true,
            egypt: false,
            airspace: true,
          },
        },
      };

      expect(getSelectedCount('gulfWar1990', { formData })).to.be.equal(2);
    });

    it('gets 0 count when no items selected', () => {
      const formData = {
        toxicExposure: {
          gulfWar1990: {
            bahrain: false,
            egypt: false,
            airspace: false,
          },
        },
      };

      expect(getSelectedCount('gulfWar1990', { formData })).to.be.equal(0);
    });

    it('gets 0 count when no checkbox values', () => {
      const formData = {
        toxicExposure: {
          gulfWar1990: {},
        },
      };

      expect(getSelectedCount('gulfWar1990', { formData })).to.be.equal(0);
    });

    it('gets 0 count when no checkbox object not found', () => {
      const formData = {};

      expect(getSelectedCount('gulfWar1990', { formData })).to.be.equal(0);
    });

    it('gets 0 count when no form data', () => {
      expect(getSelectedCount('gulfWar1990', undefined)).to.be.equal(0);
    });
  });

  describe('showGulfWar1990DetailsPage', () => {
    describe('toggle disabled', () => {
      it('should return false when toggle not enabled', () => {
        const formData = {
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

        expect(showGulfWar1990DetailsPage(formData, 'bahrain')).to.be.false;
      });
    });

    describe('toggle enabled', () => {
      beforeEach(() => {
        window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, 'true');
      });

      it('should return false when toggle enabled, but no new disabilities', () => {
        const formData = {
          newDisabilities: [],
        };

        expect(showGulfWar1990DetailsPage(formData, 'bahrain')).to.be.false;
      });

      it('should return false when toggle enabled, claiming new disability, but no selected locations', () => {
        const formData = {
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

        expect(showGulfWar1990DetailsPage(formData, 'bahrain')).to.be.false;
        expect(showGulfWar1990DetailsPage(formData, 'egypt')).to.be.false;
        expect(showGulfWar1990DetailsPage(formData, 'airspace')).to.be.false;
      });

      it('should return true when all criteria met', () => {
        const formData = {
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
        expect(showGulfWar1990DetailsPage(formData, 'bahrain')).to.be.true;
      });
    });
  });

  describe('showGulfWar1990SummaryPage', () => {
    describe('toggle disabled', () => {
      it('should return false when toggle not enabled', () => {
        const formData = {
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

        expect(showGulfWar1990SummaryPage(formData)).to.be.false;
      });
    });

    describe('toggle enabled', () => {
      beforeEach(() => {
        window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, 'true');
      });

      it('should return false when toggle enabled, but no new disabilities', () => {
        const formData = {
          newDisabilities: [],
        };

        expect(showGulfWar1990SummaryPage(formData)).to.be.false;
      });

      it('should return false when toggle enabled, claiming new disability, but no selected locations', () => {
        const formData = {
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

        expect(showGulfWar1990SummaryPage(formData)).to.be.false;
      });

      it('should return true when all criteria met', () => {
        const formData = {
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

        expect(showGulfWar1990SummaryPage(formData)).to.be.true;
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
});
