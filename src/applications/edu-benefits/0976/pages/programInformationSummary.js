import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { programInformationArrayOptions } from '../helpers';

export default {
  uiSchema: {
    'view:hasAdditionalPrograms': arrayBuilderYesNoUI(
      programInformationArrayOptions,
      {
        title: 'Do you have a program to add?',
        labelHeaderLevel: 'p',
        hint: "You'll need to add at least one program.",
        labels: {
          Y: 'Yes',
          N: 'No',
        },
        errorMessages: {
          required: 'Select ‘yes’ if you have another program to add',
        },
      },
      {
        title: 'Do you have another program to add?',
        labelHeaderLevel: 'p',
        hint: "You'll need to add at least one program.",
        labels: {
          Y: 'Yes',
          N: 'No',
        },
        errorMessages: {
          required: 'Select ‘yes’ if you have another program to add',
        },
      },
    ),
  },

  schema: {
    type: 'object',
    properties: {
      'view:hasAdditionalPrograms': arrayBuilderYesNoSchema,
    },
    required: ['view:hasAdditionalPrograms'],
  },
};
