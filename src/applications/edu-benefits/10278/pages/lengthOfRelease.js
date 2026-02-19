import {
  radioUI,
  radioSchema,
  titleUI,
  descriptionUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { parseISODate } from '~/platform/forms-system/src/js/helpers';
import { ClaimInformationDescription } from '../helpers';

function validateTerminationDate(errors, dateString) {
  const { day, month, year } = parseISODate(dateString);

  const entered = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fiveYearsFromToday = new Date(
    today.getFullYear() + 5,
    today.getMonth(),
    today.getDate(),
  );

  if (entered < fiveYearsFromToday) {
    errors.addError("You must enter a date that's 5 years in the future");
  }
}

const uiSchema = {
  ...titleUI('Length for the release of personal information'),
  ...descriptionUI(ClaimInformationDescription),
  lengthOfRelease: {
    duration: radioUI({
      title: 'Select how long you want to release your personal information.',
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
          required: "You must enter a date that's 5 years in the future",
          pattern: "You must enter a date that's 5 years in the future",
        },
        expandUnderCondition: value => value === 'date',
        required: formData => formData?.lengthOfRelease?.duration === 'date',
        expandedContentFocus: true,
      }),
      'ui:validations': [validateTerminationDate],
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
