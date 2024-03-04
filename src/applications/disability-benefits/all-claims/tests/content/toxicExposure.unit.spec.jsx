import { expect } from 'chai';
import sinon from 'sinon';
import {
  isClaimingTECondition,
  makeTEConditionsSchema,
  makeTEConditionsUISchema,
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
      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, true);
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
      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, true);
      const formData = {
        'view:claimType': {
          'view:claimingIncrease': true,
          'view:claimingNew': false,
        },
      };

      expect(showToxicExposurePages(formData)).to.be.false;
    });

    it('returns true when toggle enabled and claiming one or more new conditions and cfi', () => {
      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, true);
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

      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, true);

      expect(isClaimingTECondition(formData)).to.be.true;
    });

    it('returns false when enabled, not claiming new', () => {
      const formData = {
        'view:claimType': {
          'view:claimingIncrease': true,
          'view:claimingNew': false,
        },
      };

      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, true);

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

      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, true);

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

      window.sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, true);

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
});
