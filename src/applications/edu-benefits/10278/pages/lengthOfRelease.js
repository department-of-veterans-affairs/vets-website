import {
  radioUI,
  radioSchema,
  titleUI,
  descriptionUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { validateCurrentOrFutureDate } from '~/platform/forms-system/src/js/validation';
import { ClaimInformationDescription } from '../helpers';

const uiSchema = {
  ...titleUI('Length for the release of personal information'),
  ...descriptionUI(ClaimInformationDescription),
  lengthOfRelease: {
    duration: radioUI({
      title:
        'Select how long you want us to release your personal information.',
      labels: {
        ongoing: 'Ongoing until you give us a written notice to terminate',
        date:
          'From the date you submit this form to the date you choose to terminate',
      },
      errorMessages: {
        required: 'You must provide an answer',
      },
    }),
    date: {
      ...currentOrPastDateUI({
        title: 'Date of termination',
        hint: "This date can't be in the past",
        expandUnder: 'duration',
        monthSelect: false,
        removeDateHint: true,
        errorMessages: {
          required: 'Enter the date of the termination',
        },
        expandUnderCondition: value => value === 'date',
        required: formData => formData?.lengthOfRelease?.duration === 'date',
      }),
      'ui:validations': [validateCurrentOrFutureDate],
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    lengthOfRelease: {
      type: 'object',
      properties: {
        duration: radioSchema(['ongoing', 'date']),
        date: currentOrPastDateSchema,
      },
      required: ['duration'],
    },
  },
};

export { schema, uiSchema };
