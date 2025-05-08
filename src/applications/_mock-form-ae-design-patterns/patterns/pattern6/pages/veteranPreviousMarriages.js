import {
  titleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { veteranMarriageHistoryOptions } from './marriageHistoryConfig';

export default {
  title: 'Previous Marriages',
  path: 'other-marriages/veteran-previous',
  uiSchema: {
    ...titleUI('Previous Marriages'),
    'view:completedVeteranFormerMarriage': arrayBuilderYesNoUI(
      veteranMarriageHistoryOptions,
      {
        title: 'Have you been married before?',
        hint:
          "If yes, we'll ask for details about each prior marriage. You can add up to 10 former marriages.",
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Do you have any other marriages to add?',
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
