import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { additionalInstitutionsWithCodeArrayOptions } from '../helpers';

export default {
  uiSchema: {
    'view:hasAdditionalInstitutions': arrayBuilderYesNoUI(
      additionalInstitutionsWithCodeArrayOptions,
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
          required: 'You must make a selection',
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
          required: 'You must make a selection',
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
