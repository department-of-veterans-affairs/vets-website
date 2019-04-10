import {
  eligibilityDescription,
  eligibilityInstructions,
} from '../content/benefitsEligibility';
import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';

const { appliedForVaEducationBenefits } = fullSchema.properties;
export const uiSchema = {
  appliedForVaEducationBenefits: {
    'ui:title': eligibilityDescription,
    'ui:widget': 'yesNo',
  },
  'view:eligibilityInstructions': {
    'ui:title': '',
    'ui:description': eligibilityInstructions,
    'ui:options': {
      expandUnderCondition: false,
      hideIf: formData =>
        formData.appliedForVaEducationBenefits ||
        formData.appliedForVaEducationBenefits === undefined,
    },
  },
};

export const schema = {
  type: 'object',
  required: ['appliedForVaEducationBenefits'],
  properties: {
    appliedForVaEducationBenefits,
    'view:eligibilityInstructions': {
      type: 'object',
      properties: {},
    },
  },
};
