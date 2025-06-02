import {
  titleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { veteranMarriageHistoryOptions } from './marriageHistoryConfig';

export default {
  uiSchema: {
    ...titleUI('Review Marriages'),
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
