import {
  eligibilityDescription,
  eligibilityInstructions,
} from '../content/benefitsEligibility';
import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';

const { appliedForVAEducationBenefits } = fullSchema.properties;
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
    appliedForVAEducationBenefits,
    'view:eligibilityInstructions': {
      type: 'object',
      properties: {},
    },
  },
};
