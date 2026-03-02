import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { veteranMarriageHistoryOptions } from './marriageHistoryConfig';

export default {
  uiSchema: {
    'view:completedVeteranFormerMarriage': arrayBuilderYesNoUI(
      veteranMarriageHistoryOptions,
      {
        title: 'Do you have any previous marriages?',
        hint: "You'll need to include all past marriages.",
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Do you have any other previous marriages?',
        hint: "You'll need to include all past marriages.",
        labels: {
          Y: 'Yes',
          N: 'No',
        },
        labelHeaderLevel: 'p',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:completedVeteranFormerMarriage': arrayBuilderYesNoSchema,
    },
    required: ['view:completedVeteranFormerMarriage'],
  },
};
