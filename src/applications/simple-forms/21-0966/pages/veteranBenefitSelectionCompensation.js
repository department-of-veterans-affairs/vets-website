import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns/yesNoPattern';

/* @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'You already have an intent to file for pension',
      'Our records show that you already have an intent to file for pension.',
    ),
    benefitSelectionCompensation: yesNoUI({
      title: 'Do you also intend to file a claim for compensation?',
      labelHeaderLevel: '3',
      labels: {
        Y: 'Yes, I want to submit an intent to file for a compensation claim',
        N: 'No, I don’t intend to file a claim for compensation',
      },
      errorMessages: {
        required:
          'Please answer if you intend to file a claim for compensation',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      benefitSelectionCompensation: yesNoSchema,
    },
    required: ['benefitSelectionCompensation'],
  },
};
