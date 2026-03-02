import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { additionalInstitutionsWithoutCodeArrayOptions } from '../helpers';

export default {
  uiSchema: {
    'view:hasAdditionalInstitutions': arrayBuilderYesNoUI(
      additionalInstitutionsWithoutCodeArrayOptions,
      {
        title: 'Does your institution have additional locations?',
        labelHeaderLevel: 'p',
        hint:
          'Additional locations are officially associated with your academic institution.',
        labels: {
          Y: 'Yes, I have additional locations to add',
          N: 'No, I don’t have additional locations to add',
        },
        errorMessages: {
          required: 'You must make a selection',
        },
      },
      {
        title: 'Do you have another additional location to add?',
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
