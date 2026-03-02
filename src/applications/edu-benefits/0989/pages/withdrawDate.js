// @ts-check
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Provide the date of your withdrawal from the school'),
    dateOfWithdraw: {
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
      dateOfWithdraw: currentOrPastDateSchema,
    },
    required: ['dateOfWithdraw'],
  },
};
