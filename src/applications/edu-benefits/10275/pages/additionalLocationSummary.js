import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { additionalLocationArrayBuilderOptions } from '../helpers';

const additionalLocationSummary = {
  uiSchema: {
    addMoreLocations: arrayBuilderYesNoUI(
      additionalLocationArrayBuilderOptions,
      {
        title:
          'Do you have any additional locations you’d like to add to this agreement?',
        labels: {
          Y: 'Yes, I have additional locations to add',
          N: "No, I don't have additional locations to add",
        },
        hint: '',
        errorMessages: {
          required: 'Please provide a response',
        },
      },
      {
        title:
          'Do you have another location you’d like to add to this agreement?',
        labels: {
          Y: 'Yes, I have another location to add',
          N: "No, I don't have another location to add",
        },
        errorMessages: {
          required: 'Please provide a response',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:introduction': {
        type: 'object',
        properties: {},
      },
      addMoreLocations: arrayBuilderYesNoSchema,
    },
    required: ['addMoreLocations'],
  },
};

export const { uiSchema } = additionalLocationSummary;
export const { schema } = additionalLocationSummary;
