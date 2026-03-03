// @ts-check
import { formatDateLong } from 'platform/utilities/date';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  textUI,
  textSchema,
  addressUI,
  addressSchema,
  numberUI,
  numberSchema,
  currencyUI,
  currencySchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { validateEmploymentStartAfterDob } from '../helpers/validations';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'employers',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: true,
  isItemIncomplete: item =>
    !item?.employerName ||
    !item?.employerAddress ||
    !item?.employmentDates?.from ||
    !item?.typeOfWork ||
    !item?.hoursPerWeek ||
    !item?.lostTimeFromIllness ||
    !item?.highestGrossIncomePerMonth,
  maxItems: 4,
  text: {
    getItemName: (item, index) => item?.employerName || `Employer ${index + 1}`,
    cardDescription: itemData => {
      const fromDate = itemData?.employmentDates?.from;
      const toDate = itemData?.employmentDates?.to;

      if (!fromDate && !toDate) {
        return '';
      }

      const formatSafely = dateValue => {
        if (!dateValue) return '';
        try {
          return formatDateLong(dateValue);
        } catch (error) {
          return dateValue;
        }
      };

      if (fromDate && toDate) {
        return `${formatSafely(fromDate)} to ${formatSafely(toDate)}`;
      }

      if (fromDate) {
        return `${formatSafely(fromDate)} to present`;
      }

      return formatSafely(toDate);
    },
    summaryDescription: () => 'You can add up to 4 employers.',
  },
};

/**
 *
 * @returns {PageSchema}
 */
const employersIntroPage = {
  uiSchema: {
    'ui:title': 'Employment Information',
    'ui:description':
      'Next we’ll gather details about your current or recent employment. Please provide information about any employers or self-employment in the past 12 months.',
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/**
 *
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasEmployers': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Were you employed or self-employed at any time in the past 12 months?',
        labels: {
          Y: 'Yes, I have employment to report',
          N: "No, I don't have any employment to report",
        },
        hint:
          "If you have employment to report, you'll need to add at least one employer. You can add up to four.",
        errorMessages: {
          required: 'Select if you have employment to report.',
        },
      },
      {
        labels: {
          Y: 'Yes, I have another employer to report',
          N: "No, I don't have another employer to report",
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEmployers': arrayBuilderYesNoSchema,
    },
    required: ['view:hasEmployers'],
  },
};

/** @returns {PageSchema} */
const employerNameAndAddressPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Employer’s name and address',
      nounSingular: options.nounSingular,
    }),
    employerName: {
      ...textUI({
        title: 'Employer name',
        hint: 'If self-employed, enter "Self"',
        errorMessages: {
          required: "Enter the employer's name",
        },
        charcount: true,
      }),
    },
    employerAddress: addressUI({
      omit: ['street2', 'street3', 'isMilitary'],
      errorMessages: {
        country: "Select the employer's country.",
        street: "Enter the employer's street address",
        city: "Enter the employer's city",
        postalCode: "Enter the employer's postal code",
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      employerName: { ...textSchema, maxLength: 125 },
      employerAddress: addressSchema({
        omit: ['street2', 'street3', 'isMilitary'],
      }),
    },
    required: ['employerName', 'employerAddress'],
  },
};

/** @returns {PageSchema} */
const employmentDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.employerName
          ? `Dates you were employed at ${formData.employerName}`
          : 'Employment dates',
    ),
    employmentDates: (() => {
      const baseUiSchema = currentOrPastDateRangeUI(
        {
          title: 'Employment start date',
          errorMessages: {
            required: 'Enter start date of employment',
          },
        },
        {
          title: 'Employment end date',
          hint: 'Leave blank if you still work here.',
        },
        'End date must be after start date',
      );

      return {
        ...baseUiSchema,
        'ui:validations': [
          ...(baseUiSchema['ui:validations'] || []),
          validateEmploymentStartAfterDob,
        ],
        'ui:options': {
          ...(baseUiSchema['ui:options'] || {}),
          useAllFormData: true,
        },
      };
    })(),
  },
  schema: {
    type: 'object',
    properties: {
      employmentDates: {
        ...currentOrPastDateRangeSchema,
        required: ['from'],
      },
    },
    required: ['employmentDates'],
  },
};

/** @returns {PageSchema} */
const employmentDetailsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.employerName
          ? `Employment details for ${formData.employerName}`
          : 'Employment details',
    ),
    typeOfWork: {
      ...textUI({
        title: 'Describe the kind of work you did',
        hint:
          'For example: cashier at a grocery store, part-time landscaper, or office assistant.',
        errorMessages: {
          required: 'Enter the kind of work you did',
        },
        charcount: true,
      }),
    },
    hoursPerWeek: {
      ...numberUI({
        title: 'Hours per week',
        max: 168,
        errorMessages: {
          required: 'Enter hours per week',
          max: 'Hours per week cannot exceed 168 hours',
        },
      }),
    },
    lostTimeFromIllness: {
      ...numberUI({
        title: 'Hours of work you missed in the past 12 months',
        hint: 'Total hours',
        errorMessages: {
          required: 'Enter the number of hours of work you missed',
        },
      }),
    },
    highestGrossIncomePerMonth: {
      ...currencyUI({
        title: 'Highest monthly income (before taxes)',
        errorMessages: {
          required: 'Enter your highest monthly income',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      typeOfWork: { ...textSchema, maxLength: 35 },
      hoursPerWeek: numberSchema,
      lostTimeFromIllness: numberSchema,
      highestGrossIncomePerMonth: currencySchema,
    },
    required: [
      'typeOfWork',
      'hoursPerWeek',
      'lostTimeFromIllness',
      'highestGrossIncomePerMonth',
    ],
  },
};

export const employersPages = arrayBuilderPages(options, pageBuilder => ({
  employersIntro: pageBuilder.introPage({
    title: 'Employment Information',
    path: 'employers-intro',
    uiSchema: employersIntroPage.uiSchema,
    schema: employersIntroPage.schema,

    CustomPageReview: null,
  }),
  employersSummary: pageBuilder.summaryPage({
    title:
      'Were you employed or self-employed at any time in the past 12 months?',
    path: 'employers-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  employerNameAndAddress: pageBuilder.itemPage({
    title: 'Employer name and address',
    path: 'employers/:index/name-and-address',
    uiSchema: employerNameAndAddressPage.uiSchema,
    schema: employerNameAndAddressPage.schema,
  }),
  employmentDates: pageBuilder.itemPage({
    title: 'Employment dates',
    path: 'employers/:index/employment-dates',
    uiSchema: employmentDatesPage.uiSchema,
    schema: employmentDatesPage.schema,
  }),
  employmentDetails: pageBuilder.itemPage({
    title: 'Employment details',
    path: 'employers/:index/employment-details',
    uiSchema: employmentDetailsPage.uiSchema,
    schema: employmentDetailsPage.schema,
  }),
}));
