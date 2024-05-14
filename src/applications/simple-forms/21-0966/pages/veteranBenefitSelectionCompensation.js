import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns/yesNoPattern';
import { format } from 'date-fns';

/* @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'You already have an intent to file for pension',
      ({ formData }) =>
        `Our records show that you already have an intent to file for pension. Your intent to file will expire on ${formData?.[
          'view:activePensionITF'
        ]?.expirationDate &&
          format(
            new Date(formData['view:activePensionITF'].expirationDate),
            'MMMM d, yyyy',
          )}.`,
    ),
    benefitSelectionCompensation: yesNoUI({
      title: 'Do you also intend to file a claim for compensation?',
      labelHeaderLevel: '3',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      errorMessages: {
        required: 'Select yes if you intend to file a claim for compensation',
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
