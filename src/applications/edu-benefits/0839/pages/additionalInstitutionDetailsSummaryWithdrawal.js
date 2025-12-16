import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { additionalInstitutionDetailsArrayOptions } from '../helpers';

const uiSchema = {
  hasAdditionalInstitutionDetails: arrayBuilderYesNoUI(
    additionalInstitutionDetailsArrayOptions,
    {
      title:
        'Do you have any additional locations you’d like to withdraw from this agreement?',
      hint: '',
      labels: {
        Y: 'Yes, I have additional locations to withdraw',
        N: 'No, I don’t have additional locations to withdraw',
      },
      errorMessages: {
        required: 'Select yes if you have additional locations to withdraw',
      },
    },
    {
      title:
        'Do you have another location you’d like to withdraw from this agreement?',
      hint: '',
      labels: {
        Y: 'Yes, I have another location to withdraw',
        N: 'No, I don’t have another location to withdraw',
      },
      errorMessages: {
        required: 'Select yes if you have another location to withdraw',
      },
    },
  ),
};

const schema = {
  type: 'object',
  properties: {
    hasAdditionalInstitutionDetails: arrayBuilderYesNoSchema,
  },
  required: ['hasAdditionalInstitutionDetails'],
};

export { uiSchema, schema };
