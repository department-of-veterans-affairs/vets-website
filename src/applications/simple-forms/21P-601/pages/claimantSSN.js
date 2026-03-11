import {
  titleUI,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateClaimantSsnNotMatchVeteranSsn } from '../utils/validations';

const claimantSsnUI = ssnUI();
claimantSsnUI['ui:validations'] = [
  ...(claimantSsnUI['ui:validations'] || []),
  validateClaimantSsnNotMatchVeteranSsn,
];
claimantSsnUI['ui:options'] = {
  ...(claimantSsnUI['ui:options'] || {}),
  useAllFormData: true,
};

export default {
  uiSchema: {
    ...titleUI('Your identification information'),
    claimantIdentification: {
      ssn: claimantSsnUI,
    },
  },
  schema: {
    type: 'object',
    required: ['claimantIdentification'],
    properties: {
      claimantIdentification: {
        type: 'object',
        required: ['ssn'],
        properties: {
          ssn: ssnSchema,
        },
      },
    },
  },
};
