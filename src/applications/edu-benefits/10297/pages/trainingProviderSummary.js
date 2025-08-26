import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { trainingProviderArrayOptions } from '../helpers';

const trainingProviderSummaryPage = {
  uiSchema: {
    trainingProviders: arrayBuilderYesNoUI(
      trainingProviderArrayOptions,
      {
        title: 'Do you have a training provider to add?',
        labels: {
          Y: 'Yes, I have a training provider to add.',
          N: 'No, I do not have a training provider to add.',
        },
        hint: () =>
          'Select yes if you would like to add a training provider. You can add up to 4.',
        errorMessages: {
          required: 'Select yes if you have a training provider to add.',
        },
      },
      {
        title: 'Do you have another training provider to add?',
        labels: {
          Y: 'Yes, I have another training provider to add.',
          N: 'No, I do not have another training provider to add.',
        },
        errorMessages: {
          required: 'Select yes if you have another training provider to add.',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      trainingProviders: arrayBuilderYesNoSchema,
    },
    required: ['trainingProviders'],
  },
};

export { trainingProviderSummaryPage };
