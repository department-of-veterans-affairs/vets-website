// @ts-check
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  titleUI,
  textUI,
  textSchema,
  addressUI,
  addressSchema,
  numberUI,
  numberSchema,
  currencyUI,
  currencySchema,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { formatDateRangeForCard } from '../helpers/dateFormatting';

/** @type {ArrayBuilderOptions} */
export const arrayBuilderOptions = {
  arrayPath: 'employmentHistory',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: true, // Required flow as specified in PRD
  isItemIncomplete: item =>
    !item?.employerName ||
    !item?.employmentDateRange ||
    !item?.typeOfWork ||
    !item?.hoursPerWeek ||
    !item?.highestMonthlyIncome,
  maxItems: 5,
  text: {
    getItemName: item => item?.employerName,
    cardDescription: item => formatDateRangeForCard(item?.employmentDateRange),
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      'Your employment history',
      'Now we’re going to ask you about your employment history. Please enter your most recent employer first and work back through the past 5 years. Include any time you were on military duty and inactive duty for training.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasEmploymentHistory': arrayBuilderYesNoUI(arrayBuilderOptions, {
      title: 'Do you have employment history to add?',
      hint:
        'You must add at least one employer. You can add up to 5 past employers.',
      labelHeaderLevel: '1',
      errorMessages: {
        required: 'You must add at least one employer',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEmploymentHistory': arrayBuilderYesNoSchema,
    },
    required: ['view:hasEmploymentHistory'],
  },
};

/** @returns {PageSchema} */
const employerInformationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Employer information',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    employerName: textUI({
      title: 'Employer name',
      hint: 'If self-employed, enter your own name',
      errorMessages: {
        required: 'Enter the name of your employer',
      },
    }),
    employerAddress: addressUI({
      omit: ['street3'],
      labels: {
        street2: 'Apartment or unit number',
        militaryCheckbox:
          'The employer is on a military base in the United States.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      employerName: textSchema,
      employerAddress: addressSchema({
        omit: ['street3'],
      }),
    },
    required: ['employerName', 'employerAddress'],
  },
};

/** @returns {PageSchema} */
const workDetailsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.employerName
          ? `Details about your work at ${formData.employerName}`
          : 'Details about your work',
    ),
    typeOfWork: textUI({
      title: 'What type of work did you do?',
      errorMessages: {
        required: 'Enter the type of work you did',
      },
    }),
    hoursPerWeek: numberUI({
      title: 'How many hours did you work per week?',
      width: 'sm',
      min: 1,
      max: 168,
      errorMessages: {
        required: 'Enter hours worked per week',
      },
    }),
    highestMonthlyIncome: currencyUI({
      title: 'What was the highest gross income you earned per month?',
      hint:
        'Gross income is your total earnings (including benefits) before taxes or other deductions reflected on your paycheck.',
      errorMessages: {
        required: 'Enter your highest gross monthly earnings',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      typeOfWork: textSchema,
      hoursPerWeek: numberSchema,
      highestMonthlyIncome: currencySchema,
    },
    required: ['typeOfWork', 'hoursPerWeek', 'highestMonthlyIncome'],
  },
};

/** @returns {PageSchema} */
const employmentDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.employerName
          ? `${formData.employerName} employment dates`
          : 'Employment dates',
    ),
    employmentDateRange: currentOrPastDateRangeUI(
      {
        title: 'Employment start date',
        errorMessages: {
          required: 'Enter your employment start date',
        },
      },
      {
        title: 'Employment end date',
        errorMessages: {
          required: 'Enter your employment end date',
        },
      },
      'Employment end date must be after start date',
    ),
    daysMissedDueToDisability: numberUI({
      title: 'How many days did you miss from work because of your disability?',
      hint:
        'This field is optional. You can provide an estimate if you don’t remember the exact number.',
      width: 'sm',
      min: 0,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      employmentDateRange: currentOrPastDateRangeSchema,
      daysMissedDueToDisability: numberSchema,
    },
    required: ['employmentDateRange'],
  },
};

export const employmentHistoryPages = arrayBuilderPages(
  arrayBuilderOptions,
  pageBuilder => ({
    employmentHistoryIntro: pageBuilder.introPage({
      title: 'Employment history introduction',
      path: 'employment-history-intro',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    employmentHistorySummary: pageBuilder.summaryPage({
      title: 'Review your employment history',
      path: 'employment-history-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    employerInformation: pageBuilder.itemPage({
      title: 'Employer information',
      path: 'employment-history/:index/employer-information',
      uiSchema: employerInformationPage.uiSchema,
      schema: employerInformationPage.schema,
    }),
    workDetails: pageBuilder.itemPage({
      title: 'Work details',
      path: 'employment-history/:index/work-details',
      uiSchema: workDetailsPage.uiSchema,
      schema: workDetailsPage.schema,
    }),
    employmentDates: pageBuilder.itemPage({
      title: 'Employment dates',
      path: 'employment-history/:index/employment-dates',
      uiSchema: employmentDatesPage.uiSchema,
      schema: employmentDatesPage.schema,
    }),
  }),
);
