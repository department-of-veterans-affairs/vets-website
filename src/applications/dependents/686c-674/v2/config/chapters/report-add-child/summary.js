import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderOptions } from './config';

export const summary = {
  uiSchema: {
    'view:completedAddChild': arrayBuilderYesNoUI(
      arrayBuilderOptions,
      {
        title: 'Do you have a child to add?',
        labels: {
          Y: 'Yes, I have a child to add',
          N: 'No, I don’t have a child to add',
        },
      },
      {
        title: 'Do you have another child to add?',
        labels: {
          Y: 'Yes, I have another child to add',
          N: 'No, I don’t have another child to add',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    required: ['view:completedAddChild'],
    properties: {
      'view:completedAddChild': arrayBuilderYesNoSchema,
    },
  },
};
