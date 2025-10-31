import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { additionalLocationArrayBuilderOptions } from '../helpers';

const additionalLocationSummary = {
  uiSchema: {
    'view:introduction': {
      'ui:description':
        'You can add more locations to this agreement. If you have any more campuses or additional locations to add to this agreement, you can do so now. You will need a facility code for each location you would like to add.',
    },
    addMoreLocations: arrayBuilderYesNoUI(
      additionalLocationArrayBuilderOptions,
      {
        title:
          "Do you have any additional locations you'd like to add to this agreement?",
        labels: {
          Y: 'Yes, I have additional locations to add',
          N: "No, I don't have additional locations to add",
        },
        hint: '',
        errorMessages: {
          required: 'Please make a selection',
        },
      },
      {
        title: "Do you have another location you'd like to add?",
        labels: {
          Y: 'Yes, I have another location to add',
          N: "No, I don't have another location to add",
        },
        errorMessages: {
          required: 'Select yes if you have another location to add',
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
