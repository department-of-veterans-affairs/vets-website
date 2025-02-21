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
