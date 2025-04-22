import {
  titleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { spouseMarriageHistoryOptions } from './marriageHistoryConfig';

export default {
  uiSchema: {
    ...titleUI('Spouse Previous Marriages'),
    'view:completedSpouseFormerMarriage': arrayBuilderYesNoUI(
      spouseMarriageHistoryOptions,
      {
        title: 'Does your spouse have any former marriages?',
        hint:
          "If yes, we'll ask for details about each prior marriage. You can add up to 10 former marriages.",
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Does your spouse have any other marriages to add?',
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
      'view:completedSpouseFormerMarriage': arrayBuilderYesNoSchema,
    },
    required: ['view:completedSpouseFormerMarriage'],
  },
};
