import React from 'react';
import {
  titleUI,
  descriptionUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { validateCurrentOrPastMemorableDate } from 'platform/forms-system/src/js/validation';
import { validatePrepCourseStartDate } from '../helpers';

const uiSchema = {
  ...titleUI('Provide the start and end dates of your prep course'),
  ...descriptionUI(
    <>
      <strong>Note: </strong>
      You can apply for reimbursement after your prep course has started.
    </>,
  ),
  prepCourseStartDate: {
    ...currentOrPastDateUI({
      title: 'Course start date',
      monthSelect: false,
      required: () => true,
      'ui:description':
        'Enter 1 or 2 digits for the month and day and 4 digits for the year.',
      errorMessages: {
        pattern: 'Enter a valid date',
        required: 'Enter a start date',
      },
    }),
    'ui:validations': [
      validateCurrentOrPastMemorableDate,
      validatePrepCourseStartDate,
    ],
  },
  prepCourseEndDate: {
    ...currentOrPastDateUI({
      title: 'Course end date',
      monthSelect: false,
      required: () => true,
      'ui:description':
        'Enter 1 or 2 digits for the month and day and 4 digits for the year.',
      errorMessages: {
        pattern: 'Enter a valid date',
        required: 'Enter an end date',
      },
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    prepCourseStartDate: currentOrPastDateSchema,
    prepCourseEndDate: currentOrPastDateSchema,
  },
  required: ['prepCourseStartDate', 'prepCourseEndDate'],
};

export { schema, uiSchema };
