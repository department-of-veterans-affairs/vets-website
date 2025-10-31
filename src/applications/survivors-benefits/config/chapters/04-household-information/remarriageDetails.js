import {
  radioUI,
  radioSchema,
  textUI,
  textSchema,
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { remarriageEndOptions } from '../../../utils/labels';

/** @type {PageSchema} */
export default {
  title: 'Remarriage details',
  path: 'household/remarriage-details',
  depends: formData => formData.remarried === true,
  uiSchema: {
    ...titleUI('Remarriage details'),
    remarriageEndReason: radioUI({
      title: 'How did the marriage end?',
      labels: remarriageEndOptions,
    }),
    remarriageEndOtherReason: {
      ...textUI({
        title: 'Tell us how the marriage ended.',
        required: formData => formData?.remarriageEndReason === 'OTHER',
      }),
      'ui:options': {
        expandUnder: 'remarriageEndReason',
        expandUnderCondition: 'OTHER',
      },
    },
    remarriageDate: currentOrPastDateUI({
      title: 'Date of marriage',
      monthSelect: false,
    }),
    remarriageEndDate: currentOrPastDateUI({
      title: 'Date marriage ended',
      hint: 'Leave blank if you are still married',
      monthSelect: false,
    }),
  },
  schema: {
    type: 'object',
    required: ['remarriageEndReason', 'remarriageDate'],
    properties: {
      remarriageEndReason: radioSchema(Object.keys(remarriageEndOptions)),
      remarriageEndOtherReason: textSchema,
      remarriageDate: currentOrPastDateSchema,
      remarriageEndDate: currentOrPastDateSchema,
    },
  },
};
