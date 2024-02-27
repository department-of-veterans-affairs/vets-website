import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns/yesNoPattern';

/* @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'You already have an intent to file for compensation',
      'Our records show that you already have an intent to file for compensation.',
    ),
    benefitSelectionPension: yesNoUI({
      title: 'Do you also intend to file a claim for pension?',
      labelHeaderLevel: '3',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      errorMessages: {
        required: 'Select yes if you intend to file a claim for pension',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      benefitSelectionPension: yesNoSchema,
    },
    required: ['benefitSelectionPension'],
  },
};
