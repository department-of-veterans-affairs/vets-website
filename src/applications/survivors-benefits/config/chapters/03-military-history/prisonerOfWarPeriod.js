import {
  yesNoSchema,
  yesNoUI,
  currentOrPastDateRangeUI,
  currentOrPastDateSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @returns {PageSchema} */
const prisonerOfWar = {
  uiSchema: {
    ...titleUI('Prisoner of war status'),
    prisonerOfWar: yesNoUI({
      title: 'Was the Veteran ever a prisoner of war (POW)?',
    }),
  },
  schema: {
    type: 'object',
    required: ['prisonerOfWar'],
    properties: {
      prisonerOfWar: yesNoSchema,
    },
  },
};

/** @returns {PageSchema} */
const powPeriodOfTime = {
  uiSchema: {
    ...titleUI('Period of time held as a POW'),
    powPeriod: currentOrPastDateRangeUI(
      {
        title: 'Start date',
        monthSelect: false,
        hint:
          'Enter 1 or 2 digits for the month and day and 4 digits for the year.',
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

export { prisonerOfWar, powPeriodOfTime };
