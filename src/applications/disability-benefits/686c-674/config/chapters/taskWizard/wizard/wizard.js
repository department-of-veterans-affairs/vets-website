import { validateAtLeastOneSelected } from './helpers';

export const schema = {
  type: 'object',
  required: ['view:selectable686Options'],
  properties: {
    'view:selectable686Options': {
      type: 'object',
      properties: {
        addChild: { type: 'boolean', default: false },
        addSpouse: { type: 'boolean', default: false },
        reportDivorce: { type: 'boolean', default: false },
        reportDeath: { type: 'boolean', default: false },
        reportStepchildNotInHousehold: { type: 'boolean', default: false },
        reportMarriageOfChildUnder18: { type: 'boolean', default: false },
        reportChild18OrOlderIsNotAttendingSchool: {
          type: 'boolean',
          default: false,
        },
        report674: {
          type: 'boolean',
          default: false,
        },
      },
    },
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
