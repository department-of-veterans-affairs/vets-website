import {
  currentOrPastDateRangeUI,
  dateRangeSchema,
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  path: 'military/pow',
  title: 'POW status',
  uiSchema: {
    ...titleUI('Prisoner of war status'),
    powStatus: yesNoUI({
      title: 'Have you ever been a prisoner of war?',
      classNames: 'vads-u-margin-bottom--2',
    }),
    powDateRange: {
      ...currentOrPastDateRangeUI({
        fromOptions: 'Start of confinement',
        toOptions: 'End of confinement',
        errorMessage: 'Confinement start date must be before end date',
      }),
      'ui:options': {
        expandUnder: 'powStatus',
        expandUnderCondition: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['powStatus'],
    properties: {
      powStatus: yesNoSchema,
      powDateRange: {
        ...dateRangeSchema,
        required: [],
      },
    },
  },
};
