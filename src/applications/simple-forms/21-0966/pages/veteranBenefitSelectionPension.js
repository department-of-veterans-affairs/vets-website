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
      'You already have an intent to file for compensation',
      ({ formData }) =>
        `Our records show that you already have an intent to file for compensation. Your intent to file will expire on ${formData?.[
          'view:activeCompensationITF'
        ]?.expirationDate &&
          format(
            new Date(formData['view:activeCompensationITF'].expirationDate),
            'MMMM d, yyyy',
          )}.`,
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
