import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  dateHelp,
  dateRangePageDescription,
  getKeyIndex,
  getSelectedCount,
  isClaimingTECondition,
  makeTEConditionsSchema,
  makeTEConditionsUISchema,
  showGulfWar1990LocationDatesPage,
  showToxicExposurePages,
  validateTEConditions,
} from '../../content/toxicExposure';
import { SHOW_TOXIC_EXPOSURE } from '../../constants';

describe('toxicExposure', () => {
  afterEach(() => {
    window.sessionStorage.removeItem(SHOW_TOXIC_EXPOSURE);
  });

  describe('showToxicExposurePages', () => {
    it('returns false when toggle disabled and claim type is new', () => {
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

    it('returns false when toggle disabled and claiming cfi', () => {
      const formData = {
        'view:claimType': {
          'view:claimingIncrease': true,
          'view:claimingNew': false,
        },
      };

      expect(showToxicExposurePages(formData)).to.be.false;
    });

    it('returns false when toggle disabled and both claim types', () => {
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

    it('returns true when toggle enabled and claiming one or more new conditions', () => {
      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, 'true');
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

    it('returns false when toggle enabled and claiming cfi', () => {
      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, 'true');
      const formData = {
        'view:claimType': {
          'view:claimingIncrease': true,
          'view:claimingNew': false,
        },
      };

      expect(showToxicExposurePages(formData)).to.be.false;
    });

    it('returns true when toggle enabled and claiming one or more new conditions and cfi', () => {
      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, 'true');
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

  describe('isClaimingTECondition', () => {
    it('returns true when enabled, claiming new, one condition selected', () => {
      const formData = {
        'view:claimType': {
          'view:claimingIncrease': false,
          'view:claimingNew': true,
        },
        toxicExposureConditions: {
          tinnitus: true,
          anemia: false,
          none: false,
        },
      };

      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, 'true');

      expect(isClaimingTECondition(formData)).to.be.true;
    });

    it('returns false when enabled, not claiming new', () => {
      const formData = {
        'view:claimType': {
          'view:claimingIncrease': true,
          'view:claimingNew': false,
        },
      };

      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, 'true');

      expect(isClaimingTECondition(formData)).to.be.false;
    });

    it('returns false when enabled, claiming new, no conditions selected', () => {
      const formData = {
        'view:claimType': {
          'view:claimingIncrease': false,
          'view:claimingNew': true,
        },
        toxicExposureConditions: {
          tinnitus: false,
          anemia: false,
          none: false,
        },
      };

      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, 'true');

      expect(isClaimingTECondition(formData)).to.be.false;
    });

    it('returns false when enabled, selected none checkbox', () => {
      const formData = {
        'view:claimType': {
          'view:claimingIncrease': false,
          'view:claimingNew': true,
        },
        toxicExposureConditions: {
          tinnitus: false,
          anemia: false,
          none: true,
        },
      };

      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, 'true');

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
        toxicExposureConditions: {
          addError: sinon.spy(),
        },
      };

      const formData = {
        toxicExposureConditions: {
          anemia: true,
          tinnitusringingorhissinginears: false,
          none: true,
        },
      };

      validateTEConditions(errors, formData);
      expect(errors.toxicExposureConditions.addError.called).to.be.true;
    });

    it('should not add error when selecting conditions', () => {
      const errors = {
        toxicExposureConditions: {
          addError: sinon.spy(),
        },
      };

      const formData = {
        toxicExposureConditions: {
          anemia: true,
          tinnitusringingorhissinginears: true,
          none: false,
        },
      };

      validateTEConditions(errors, formData);
      expect(errors.toxicExposureConditions.addError.called).to.be.false;
    });
  });

  describe('dateRangePageDescription', () => {
    it('displays description when counts specified', () => {
      const tree = render(dateRangePageDescription(1, 5, 'Egypt'));
      tree.getByText('1 of 5: Egypt', { exact: false });
      tree.getByText(dateHelp);
    });

    it('displays description when counts not specified', () => {
      const tree = render(dateRangePageDescription(0, -1, 'Egypt'));
      tree.getByText('Egypt');
      tree.getByText(dateHelp);
    });
  });

  describe('getKeyIndex', () => {
    it('finds and returns the index', () => {
      const formData = {
        gulfWar1990: {
          bahrain: true,
          egypt: false,
          airspace: true,
        },
      };

      expect(getKeyIndex('bahrain', 'gulfWar1990', { formData })).to.equal(1);
      expect(getKeyIndex('airspace', 'gulfWar1990', { formData })).to.equal(2);
    });

    it('returns 0 when not location data not available', () => {
      const formData = {};

      expect(getKeyIndex('bahrain', 'gulfWar1990', { formData })).to.equal(0);
    });

    it('returns 0 when location not selected', () => {
      const formData = {
        gulfWar1990: {
          egypt: false,
        },
      };

      expect(getKeyIndex('egypt', 'gulfWar1990', { formData })).to.equal(0);
      expect(getKeyIndex('bahrain', 'gulfWar1990', { formData })).to.equal(0);
    });
  });

  describe('getSelectedCount', () => {
    it('gets the count with a mix of selected and deselected items', () => {
      const formData = {
        gulfWar1990: {
          bahrain: true,
          egypt: false,
          airspace: true,
        },
      };

      expect(getSelectedCount('gulfWar1990', { formData })).to.be.equal(2);
    });

    it('gets 0 count when no items selected', () => {
      const formData = {
        gulfWar1990: {
          bahrain: false,
          egypt: false,
          airspace: false,
        },
      };

      expect(getSelectedCount('gulfWar1990', { formData })).to.be.equal(0);
    });

    it('gets 0 count when no checkbox values', () => {
      const formData = {
        gulfWar1990: {},
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

  describe('showGulfWar1990LocationDatesPage', () => {
    afterEach(() => {
      window.sessionStorage.removeItem(SHOW_TOXIC_EXPOSURE);
    });

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
      };

      expect(showGulfWar1990LocationDatesPage(formData, 'bahrain')).to.be.false;
    });

    it('should return false when toggle enabled, but no new disabilities', () => {
      const formData = {
        newDisabilities: [],
      };
      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, 'true');

      expect(showGulfWar1990LocationDatesPage(formData, 'bahrain')).to.be.false;
    });

    it('should return false when toggle enabled, claiming new disability, but no selected locations', () => {
      const formData = {
        gulfWar1990: {
          bahrain: false,
          airspace: false,
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
      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, 'true');

      expect(showGulfWar1990LocationDatesPage(formData, 'bahrain')).to.be.false;
      expect(showGulfWar1990LocationDatesPage(formData, 'egypt')).to.be.false;
      expect(showGulfWar1990LocationDatesPage(formData, 'airspace')).to.be
        .false;
    });

    it('should return true when all criteria met', () => {
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
      };
      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, 'true');

      expect(showGulfWar1990LocationDatesPage(formData, 'bahrain')).to.be.true;
    });
  });
});
