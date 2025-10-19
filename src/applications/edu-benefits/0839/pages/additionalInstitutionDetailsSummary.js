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
        "Do you have any additional locations you'd like to add to this agreement?",
      hint: '',
      labels: {
        Y: 'Yes, I have additional locations to add',
        N: "No, I don't have additional locations to add",
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
