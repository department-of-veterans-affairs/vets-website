import {
  currentOrPastDateRangeUI,
  currentOrPastDateSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
const powPeriodOfTimePage = {
  uiSchema: {
    ...titleUI('Period of time held as a POW'),
    powPeriod: currentOrPastDateRangeUI(
      {
        title: 'Start date',
        monthSelect: false,
      },
      {
        title: 'End date',
        monthSelect: false,
      },
    ),
  },
  schema: {
    type: 'object',
    required: ['powPeriod'],
    properties: {
      powPeriod: {
        type: 'object',
        required: ['from', 'to'],
        properties: {
          from: currentOrPastDateSchema,
          to: currentOrPastDateSchema,
        },
      },
    },
  },
};

export default powPeriodOfTimePage;
