import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';

/** @returns {PageSchema} */
export const datePage = {
  title: 'Dates you were employed',
  path: 'employers/:index/dates',
  uiSchema: {
    ...webComponentPatterns.arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.name
          ? `Dates you were employed at ${formData.name}`
          : 'Dates you were employed',
    ),
    dateRange: webComponentPatterns.currentOrPastDateRangeUI(
      'Start date of employment',
      'End date of employment',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      dateRange: webComponentPatterns.currentOrPastDateRangeSchema,
    },
    required: ['dateRange'],
  },
};

/** @type {PageSchema} */
export const detailPage = {
  path: 'employers/:index/detail',
  schema: {
    properties: {
      typeOfWork: webComponentPatterns.textSchema,
      hoursPerWeek: webComponentPatterns.numberSchema,
      lostTime: webComponentPatterns.numberSchema,
      highestIncome: webComponentPatterns.textSchema,
    },
    required: ['typeOfWork', 'hoursPerWeek', 'lostTime', 'highestIncome'],
    type: 'object',
  },
  title: 'Employment detail for employer',
  uiSchema: {
    ...webComponentPatterns.arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.name
          ? `Employment detail for ${formData.name}`
          : 'Employment detail',
    ),
    typeOfWork: webComponentPatterns.textUI({
      hint: 'If self-employed enter "Self"',
      title: 'Type of work',
    }),
    hoursPerWeek: webComponentPatterns.numberUI({
      title: 'Hours per week',
      min: 0,
      max: 168,
    }),
    lostTime: webComponentPatterns.numberUI({
      hint: 'Total hours',
      title: 'Lost time from illness',
      min: 0,
      max: 8760,
    }),
    highestIncome: webComponentPatterns.textUI({
      currency: true,
      hint: 'Total $ amount',
      title: 'Highest gross income per month',
    }),
  },
};
