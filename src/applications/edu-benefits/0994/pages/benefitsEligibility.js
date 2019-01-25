import {
  eligibilityDescription,
  eligibilityInstructions,
} from '../content/benefitsEligibility';

export const uiSchema = {
  'view:vetTecEligibility': {
    'ui:title': eligibilityDescription,
    'ui:widget': 'yesNo',
  },
  'view:eligibilityInstructions': {
    'ui:title': '',
    'ui:description': eligibilityInstructions,
    'ui:options': {
      expandUnder: 'view:vetTecEligibility',
      expandUnderCondition: false,
    },
  },
};

export const schema = {
  type: 'object',
  required: ['view:vetTecEligibility'],
  properties: {
    'view:vetTecEligibility': {
      type: 'boolean',
    },
    'view:eligibilityInstructions': {
      type: 'object',
      properties: {},
    },
  },
};
