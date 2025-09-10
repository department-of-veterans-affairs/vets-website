import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  textUI,
  textSchema,
  addressUI,
  addressSchema,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  currencyUI,
  currencySchema,
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const options = {
  arrayPath: 'employers',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: false, // Optional array - user can skip if no employment
  maxItems: 4,
  isItemIncomplete: item => {
    return (
      !item?.name ||
      !item?.address ||
      !item?.employmentDates ||
      !item?.typeOfWork ||
      !item?.hoursPerWeek ||
      !item?.lostTimeFromIllness ||
      !item?.highestGrossIncome
    );
  },
  text: {
    getItemName: (item, index) => item?.name || `Employer ${index + 1}`,
    cardDescription: item => {
      const parts = [];
      if (item?.address?.city && item?.address?.state) {
        parts.push(`${item.address.city}, ${item.address.state}`);
      }
      if (item?.employmentDates?.from && item?.employmentDates?.to) {
        parts.push(`${item.employmentDates.from} - ${item.employmentDates.to}`);
      }
      return parts.join(' • ');
    },
    summaryTitle: 'Review your employers',
    summaryDescription:
      "Here are the employers you've added. You can add up to 4 employers total.",
  },
};

export const employersPages = arrayBuilderPages(options, pageBuilder => ({
  employersSummary: pageBuilder.summaryPage({
    title: 'Review your employers',
    path: 'employers-summary',
    uiSchema: {
      'view:hasEmployers': arrayBuilderYesNoUI(options),
    },
    schema: {
      type: 'object',
      properties: {
        'view:hasEmployers': arrayBuilderYesNoSchema,
      },
      required: ['view:hasEmployers'],
    },
  }),

  employerName: pageBuilder.itemPage({
    title: 'Name and address of employer',
    path: 'employers/:index/name-and-address',
    uiSchema: {
      ...arrayBuilderItemFirstPageTitleUI({
        title: 'Name and address of employer',
        nounSingular: options.nounSingular,
      }),
      name: textUI({
        title: 'Name of employer',
        errorMessages: {
          required: 'Enter name of employer',
        },
      }),
      address: addressUI(),
    },
    schema: {
      type: 'object',
      properties: {
        name: textSchema,
        address: addressSchema(),
      },
      required: ['name', 'address'],
    },
  }),

  employerDates: pageBuilder.itemPage({
    title: 'Dates you were employed',
    path: 'employers/:index/employment-dates',
    uiSchema: {
      ...arrayBuilderItemSubsequentPageTitleUI(
        'Dates you were employed at [employerName]',
      ),
      employmentDates: currentOrPastDateRangeUI(
        'Start date of employment',
        'End date of employment',
        'End date must be after start date',
      ),
    },
    schema: {
      type: 'object',
      properties: {
        employmentDates: currentOrPastDateRangeSchema,
      },
      required: ['employmentDates'],
    },
  }),

  employerDetails: pageBuilder.itemPage({
    title: 'Employment details',
    path: 'employers/:index/employment-details',
    uiSchema: {
      ...arrayBuilderItemSubsequentPageTitleUI(
        'Employment details for [employerName]',
      ),
      typeOfWork: textUI({
        title: 'Type of work',
        hint: 'If self-employed enter "Self"',
        errorMessages: {
          required: 'Enter type of work',
        },
      }),
      hoursPerWeek: numberUI({
        title: 'Hours per week',
        errorMessages: {
          required: 'Enter hours per week',
        },
      }),
      lostTimeFromIllness: numberUI({
        title: 'Lost time from illness',
        hint: 'Total hours',
        errorMessages: {
          required: 'Enter lost time from illness in total hours',
        },
      }),
      highestGrossIncome: currencyUI({
        title: 'Highest gross income per month',
        hint: 'Total $ amount',
        errorMessages: {
          required: 'Enter highest gross income per month',
        },
      }),
    },
    schema: {
      type: 'object',
      properties: {
        typeOfWork: textSchema,
        hoursPerWeek: numberSchema,
        lostTimeFromIllness: numberSchema,
        highestGrossIncome: currencySchema,
      },
      required: [
        'typeOfWork',
        'hoursPerWeek',
        'lostTimeFromIllness',
        'highestGrossIncome',
      ],
    },
  }),
}));
