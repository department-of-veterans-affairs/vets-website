import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
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

/** @returns {PageSchema} */
export const introPage = options => ({
  path: 'employers',
  title: 'Employers',
  uiSchema: {
    ...webComponentPatterns.titleUI(
      `Treatment records`,
      `In the next few questions, we’ll ask you about the treatment records you’re requesting. You must add at least one treatment request. You may add up to ${
        options.maxItems
      }.`,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
});

/** @returns {PageSchema} */
export const namePage = options => ({
  title: 'Name and address of employer or unit',
  path: 'employers/:index/name-and-address',
  uiSchema: {
    ...webComponentPatterns.arrayBuilderItemFirstPageTitleUI({
      title: 'Name and address of employer or unit',
      nounSingular: options.nounSingular,
    }),
    name: webComponentPatterns.textUI('Name of employer'),
    address: webComponentPatterns.addressNoMilitaryUI({
      omit: ['street2', 'street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      name: webComponentPatterns.textSchema,
      address: webComponentPatterns.addressNoMilitarySchema({
        omit: ['street2', 'street3'],
      }),
    },
    required: ['name', 'address'],
  },
});

/** @returns {PageSchema} */
export const summaryPage = options => ({
  path: options.required ? 'employers-summary' : 'employers',
  schema: {
    type: 'object',
    properties: {
      'view:hasEmployers': webComponentPatterns.arrayBuilderYesNoSchema,
    },
    required: ['view:hasEmployers'],
  },
  title: options.required ? 'Review your employers' : 'Your employers',
  uiSchema: {
    'view:hasEmployers': webComponentPatterns.arrayBuilderYesNoUI(
      options,
      {
        title:
          'Were you employed by the VA, others or self-employed at any time during the last 12 months?',
        labels: {
          Y: 'Yes, I have employment to report',
          N: 'No, I don’t have any employment to report',
        },
      },
      {
        title: 'Do you have another employer to report?',
        labels: {
          Y: 'Yes, I have another employment to report',
          N: 'No, I don’t have another employment to report',
        },
      },
    ),
  },
});
