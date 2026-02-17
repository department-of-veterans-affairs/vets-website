// @ts-check
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  numberUI,
  numberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateCurrentOrPastMemorableDate } from 'platform/forms-system/src/js/validation';

const validateDifferentDates = (errors, fieldData, formData) => {
  const date1 = formData?.graduatedClass1Date;
  const date2 = formData?.graduatedClass2Date;

  if (!!date1 && !!date2 && date1 === date2) {
    errors.addError('The dates of both graduating classes cannot be the same.');
  }
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Medical School Information'),
    graduatedClass1Date: {
      ...currentOrPastDateUI({
        title: 'Date of graduating class',
        hint: 'Include the date (month, day, year) of one of the two graduating classes.',
        required: () => true,
        monthSelect: false,
        removeDateHint: true,
      }),
      'ui:validations': [
        validateCurrentOrPastMemorableDate,
        validateDifferentDates,
      ],
      'ui:errorMessages': {
        required: 'You must enter a date',
      },
    },
    graduatedClass1Count: {
      ...numberUI({
        title: 'Number of students that graduated',
        min: 0,
        max: 50000,
        errorMessages: {
          required: 'Enter the number of students that graduated',
        },
      }),
    },
    graduatedClass2Date: {
      ...currentOrPastDateUI({
        title: 'Date of graduating class',
        hint: 'Include the date (month, day, year) of one of the two graduating classes.',
        required: () => true,
        monthSelect: false,
        removeDateHint: true,
      }),
      'ui:validations': [
        validateCurrentOrPastMemorableDate,
        validateDifferentDates,
      ],
      'ui:errorMessages': {
        required: 'You must enter a date',
      },
    },
    graduatedClass2Count: {
      ...numberUI({
        title: 'Number of students that graduated',
        min: 0,
        max: 50000,
        errorMessages: {
          required: 'Enter the number of students that graduated',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      graduatedClass1Date: currentOrPastDateSchema,
      graduatedClass1Count: numberSchema,
      graduatedClass2Date: currentOrPastDateSchema,
      graduatedClass2Count: numberSchema,
    },
    required: [
      'graduatedClass1Date',
      'graduatedClass1Count',
      'graduatedClass2Date',
      'graduatedClass2Count',
    ],
  },
};
