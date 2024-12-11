import { expect } from 'chai';
import sinon from 'sinon';
import {
  makeMHConditionsSchema,
  makeMHConditionsUISchema,
  showMentalHealthPages,
  validateMHConditions,
} from '../../content/mentalHealth';

describe('mentalHealth', () => {
  let formData;

  describe('showMentalHealthPages', () => {
    describe('syncModern0781Flow is true', () => {
      it('returns true when claiming one or more new conditions', () => {
        formData = {
          syncModern0781Flow: true,
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

        expect(showMentalHealthPages(formData)).to.be.true;
      });

      it('returns false when claim type is CFI only', () => {
        formData = {
          syncModern0781Flow: true,
          'view:claimType': {
            'view:claimingIncrease': true,
            'view:claimingNew': false,
          },
        };

        expect(showMentalHealthPages(formData)).to.be.false;
      });

      it('returns true when both claim types', () => {
        formData = {
          syncModern0781Flow: true,
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

        expect(showMentalHealthPages(formData)).to.be.true;
      });
    });
  });

  describe('makeMHConditionsSchema', () => {
    it('creates schema for mental health conditions', () => {
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

      expect(makeMHConditionsSchema(formData)).to.eql({
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

  describe('makeMHConditionsUISchema', () => {
    it('creates ui schema for mental health conditions', () => {
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

      expect(makeMHConditionsUISchema(formData)).to.eql({
        anemia: {
          'ui:title': 'Anemia',
        },
        tinnitusringingorhissinginears: {
          'ui:title': 'Tinnitus (ringing or hissing in ears)',
        },
        none: {
          'ui:title':
            'I am not claiming any mental health conditions related to a traumatic event.',
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

      expect(makeMHConditionsUISchema(formData)).to.eql({
        unknowncondition: {
          'ui:title': 'Unknown Condition',
        },
        none: {
          'ui:title':
            'I am not claiming any mental health conditions related to a traumatic event.',
        },
      });
    });
  });

  describe('validateMHConditions', () => {
    it('should add error when selecting none and a condition', () => {
      const errors = {
        mentalHealth: {
          conditions: {
            addError: sinon.spy(),
          },
        },
      };

      formData = {
        mentalHealth: {
          conditions: {
            anemia: true,
            tinnitusringingorhissinginears: false,
            none: true,
          },
        },
      };

      validateMHConditions(errors, formData);
      expect(errors.mentalHealth.conditions.addError.called).to.be.true;
    });

    it('should not add error when selecting conditions', () => {
      const errors = {
        mentalHealth: {
          conditions: {
            addError: sinon.spy(),
          },
        },
      };

      formData = {
        mentalHealth: {
          conditions: {
            anemia: true,
            tinnitusringingorhissinginears: true,
            none: false,
          },
        },
      };

      validateMHConditions(errors, formData);
      expect(errors.mentalHealth.conditions.addError.called).to.be.false;
    });
  });
});
