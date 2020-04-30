import { validateAtLeastOneSelected } from './helpers';
import { optionSelection } from '../../../utilities';

export const schema = {
  type: 'object',
  required: ['view:selectable686Options'],
  properties: {
    'view:selectable686Options': optionSelection['view:selectable686Options'],
  },
};

export const uiSchema = {
  'view:selectable686Options': {
    'ui:options': { showFieldLabel: true },
    'ui:validations': [validateAtLeastOneSelected],
    'ui:title': 'What would you like to do? (Check all that apply)',
    addChild: {
      'ui:title': 'Claim additional benefits for a child',
    },
    addSpouse: {
      'ui:title': 'Claim additional benefits for a spouse',
    },
    reportDivorce: {
      'ui:title': 'Report a divorce',
    },
    reportStepchildNotInHousehold: {
      'ui:title':
        'Report that a stepchild is no longer a member of your household',
    },
    reportDeath: {
      'ui:title': 'Report the death of a spouse, child or dependent parent',
    },
    reportMarriageOfChildUnder18: {
      'ui:title': 'Report the marriage of a child under 18',
    },
    reportChild18OrOlderIsNotAttendingSchool: {
      'ui:title':
        'Report that a child 18 or older has stopped attending school',
    },
    report674: {
      'ui:title': 'Request approval of school attendance for child 18 or older',
    },
  },
};
