import {
  eligibilityDescription,
  eligibilityInstructions,
} from '../content/benefitsEligibility';
import _ from 'lodash';
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
      hideIf: data => _.get(data, 'appliedForVaEducationBenefits', true),
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
