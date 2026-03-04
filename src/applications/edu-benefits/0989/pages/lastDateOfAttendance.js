// @ts-check
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'What was your last date of attendance at the closed or disapproved school or in the new program?',
    ),
    lastDateOfAttendance: {
      ...currentOrPastDateUI({
        title: 'Your school withdrawal date',
        hint:
          'If you are not sure of the withdrawal date, enter the approximate date.',
        required: () => true,
        monthSelect: false,
        removeDateHint: true,
      }),
      'ui:errorMessages': {
        required: 'You must enter a date',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      lastDateOfAttendance: currentOrPastDateSchema,
    },
    required: ['lastDateOfAttendance'],
  },
};
