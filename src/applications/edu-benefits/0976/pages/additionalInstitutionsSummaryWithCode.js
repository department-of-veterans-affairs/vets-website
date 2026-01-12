import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { additionalInstitutionsArrayOptions } from '../helpers';

export default {
  uiSchema: {
    'view:hasAdditionalInstitutions': arrayBuilderYesNoUI(
      additionalInstitutionsArrayOptions,
      {
        title:
          'Do you have any additional locations you’d like to add to this application?',
        labelHeaderLevel: 'p',
        hint: '',
        labels: {
          Y: 'Yes, I have additional locations to add',
          N: 'No, I don’t have additional locations to add',
        },
        errorMessages: {
          required: 'Select ‘yes’ if you have a additional locations to add',
        },
      },
      {
        title:
          'Do you have another location you’d like to add to this application?',
        labelHeaderLevel: 'p',
        hint: '',
        labels: {
          Y: 'Yes, I have another location to add',
          N: "No, I don't have another location to add",
        },
        errorMessages: {
          required: 'Select ‘yes’ if you have an additional location to add',
        },
      },
    ),
  },

  schema: {
    type: 'object',
    properties: {
      'view:hasAdditionalInstitutions': arrayBuilderYesNoSchema,
    },
    required: ['view:hasAdditionalInstitutions'],
  },
};
