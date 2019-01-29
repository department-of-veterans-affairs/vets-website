import {
  eligibilityDescription,
  eligibilityInstructions,
} from '../content/benefitsEligibility';

export const uiSchema = {
  appliedForVAEducationBenefits: {
    'ui:title': eligibilityDescription,
    'ui:widget': 'yesNo',
  },
  'view:eligibilityInstructions': {
    'ui:title': '',
    'ui:description': eligibilityInstructions,
    'ui:options': {
      expandUnder: 'appliedForVAEducationBenefits',
      expandUnderCondition: false,
    },
  },
};

export const schema = {
  type: 'object',
  required: ['appliedForVAEducationBenefits'],
  properties: {
    appliedForVAEducationBenefits: {
      type: 'boolean',
    },
    'view:eligibilityInstructions': {
      type: 'object',
      properties: {},
    },
  },
};
