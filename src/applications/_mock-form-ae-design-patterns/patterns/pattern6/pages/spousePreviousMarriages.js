import {
  titleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { spouseMarriageHistoryOptions } from './marriageHistoryConfig';

export default {
  uiSchema: {
    ...titleUI('Has your spouse been married before?'),
    'view:completedSpouseFormerMarriage': {
      ...arrayBuilderYesNoUI(
        spouseMarriageHistoryOptions,
        {
          title: ' ',
          labels: {
            Y: 'Yes',
            N: 'No',
          },
        },
        {
          title: 'Does your spouse have any other previous marriages?',
          hint:
            'You’ll need to include all of their past marriages, even ones that ended in divorce, annulment, or death.',
          labels: {
            Y: 'Yes',
            N: 'No',
          },
        },
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:completedSpouseFormerMarriage': arrayBuilderYesNoSchema,
    },
    // required: ['view:completedSpouseFormerMarriage'],
  },
};
