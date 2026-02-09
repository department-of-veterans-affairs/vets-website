import {
  radioUI,
  radioSchema,
  textUI,
  titleUI,
  currentOrPastDateRangeUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { remarriageEndOptions } from '../../../utils/labels';
import { customTextSchema } from '../../definitions';

/** @type {PageSchema} */
export default {
  title: 'Remarriage details',
  path: 'household/remarriage-details',
  depends: formData => formData.remarried === true,
  uiSchema: {
    ...titleUI('Remarriage details'),
    remarriageEndCause: radioUI({
      title: 'How did the marriage end?',
      labels: remarriageEndOptions,
    }),
    endCauseExplanation: {
      ...textUI({
        title: 'Tell us how the marriage ended.',
        required: formData => formData?.remarriageEndCause === 'other',
      }),
      'ui:options': {
        expandUnder: 'remarriageEndCause',
        expandUnderCondition: 'other',
      },
    },
    remarriageDates: currentOrPastDateRangeUI(
      {
        title: 'Date of marriage',
        monthSelect: false,
      },
      {
        title: 'Date marriage ended',
        hint: 'Leave blank if you are still married',
        monthSelect: false,
      },
    ),
  },
  schema: {
    type: 'object',
    required: ['remarriageEndCause', 'remarriageDates'],
    properties: {
      remarriageEndCause: radioSchema(Object.keys(remarriageEndOptions)),
      endCauseExplanation: customTextSchema,
      remarriageDates: {
        type: 'object',
        required: ['from'],
        properties: {
          from: currentOrPastDateSchema,
          to: currentOrPastDateSchema,
        },
      },
    },
  },
};
