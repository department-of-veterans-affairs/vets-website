import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  phoneSchema,
  phoneUI,
  textSchema,
  textUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import YourEmployersDescription from '../../components/YourEmployersDescription';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'employers',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: true,
  isItemIncomplete: item =>
    !item?.employerName ||
    !item?.employerPositionTitle ||
    !item.employerSupervisorName ||
    !item.employerAddress ||
    !item.employerPhoneNumber ||
    !item.employerDateRange,
  text: {
    getItemName: item => item.employerName,
    cardDescription: item =>
      `${formatReviewDate(item?.employerDateRange?.from)} - ${formatReviewDate(
        item?.employerDateRange?.to,
      )}`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(`Your employers`, YourEmployersDescription),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const informationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Employer and position information',
      nounSingular: options.nounSingular,
    }),
    employerName: textUI('Name of employer'),
    employerPositionTitle: textUI('Position title'),
    employerSupervisorName: textUI('Supervisor name'),
  },
  schema: {
    type: 'object',
    properties: {
      employerName: textSchema,
      employerPositionTitle: textSchema,
      employerSupervisorName: textSchema,
    },
    required: [
      'employerName',
      'employerPositionTitle',
      'employerSupervisorName',
    ],
  },
};

/** @returns {PageSchema} */
const addressAndPhoneNumberPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.employerName
          ? `${formData.employerName} address and phone number`
          : 'Address and phone number',
    ),
    employerAddress: addressNoMilitaryUI({
      omit: ['street3'],
    }),
    employerPhoneNumber: phoneUI(),
    employerPhoneExtension: {
      'ui:title': 'Extension',
      'ui:webComponentField': VaTextInputField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      employerAddress: addressNoMilitarySchema({
        omit: ['street3'],
      }),
      employerPhoneNumber: phoneSchema,
      employerPhoneExtension: {
        type: 'string',
        pattern: '^[a-zA-Z0-9]{1,10}$',
        maxLength: 10,
      },
    },
    required: ['employerAddress', 'employerPhoneNumber'],
  },
};

/** @returns {PageSchema} */
const dateRangePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.employerName
          ? `Dates you were employed at ${formData.employerName}`
          : 'Dates you were employed',
    ),
    employerDateRange: currentOrPastDateRangeUI(
      'Employment start date',
      'Employment end date',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      employerDateRange: currentOrPastDateRangeSchema,
    },
    required: ['employerDateRange'],
  },
};

/**
 * This page is skipped on the first loop for required flow
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasEmployers': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Do you have any employment, including self-employment for the last 5 years to report?',
        hint:
          'Includes self-employment and military duty (including inactive duty for training).',
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
  schema: {
    type: 'object',
    properties: {
      'view:hasEmployers': arrayBuilderYesNoSchema,
    },
    required: ['view:hasEmployers'],
  },
};

const employersPages = arrayBuilderPages(options, pageBuilder => ({
  employers: pageBuilder.introPage({
    title: 'Your employers',
    path: 'employers',
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  employersSummary: pageBuilder.summaryPage({
    title: 'Review your employers',
    path: 'employers-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  employerInformationPage: pageBuilder.itemPage({
    title: 'Employer information',
    path: 'employers/:index/information',
    uiSchema: informationPage.uiSchema,
    schema: informationPage.schema,
  }),
  employerAddressAndPhoneNumberPage: pageBuilder.itemPage({
    title: 'Employer address and phone',
    path: 'employers/:index/address-phone-number',
    uiSchema: addressAndPhoneNumberPage.uiSchema,
    schema: addressAndPhoneNumberPage.schema,
  }),
  employerDateRangePage: pageBuilder.itemPage({
    title: 'Employment dates',
    path: 'employers/:index/date-range',
    uiSchema: dateRangePage.uiSchema,
    schema: dateRangePage.schema,
  }),
}));

export default employersPages;
