import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  addressSchema,
  addressUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  descriptionUI,
  phoneSchema,
  phoneUI,
  textareaUI,
  textareaSchema,
  textSchema,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import EmploymentIntro from '../../components/03-employment-history-chapter/EmploymentIntro';
import { formatReviewDate } from '../helpers/formatReviewDate';

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'employers',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: true,
  isItemIncomplete: item =>
    !item?.name ||
    !item?.positionTitle ||
    !item?.supervisorName ||
    !item?.address ||
    !item?.phone ||
    !item?.dateRange ||
    !item?.reasonForLeaving,
  text: {
    getItemName: item => item.name,
    cardDescription: item =>
      `${formatReviewDate(item?.dateRange?.from)} - ${formatReviewDate(
        item?.dateRange?.to,
      )}`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...descriptionUI(EmploymentIntro),
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
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    name: textUI('Name of employer'),
    positionTitle: textUI('Position title'),
    supervisorName: textUI({
      title: 'Supervisor name',
      hint: 'If you are self-employed, write "self."',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
      positionTitle: textSchema,
      supervisorName: textSchema,
    },
    required: ['name', 'positionTitle', 'supervisorName'],
  },
};

/** @returns {PageSchema} */
const addressAndPhoneNumberPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.name
          ? `${formData.name} address and phone number`
          : 'Address and phone number',
    ),
    address: addressUI({
      labels: {
        militaryCheckbox:
          'I work on a United States military base outside of the U.S.',
      },
    }),
    phone: phoneUI(),
    extension: textUI({
      title: 'Extension',
      width: 'sm',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema({
        omit: ['street3'],
      }),
      phone: phoneSchema,
      extension: {
        type: 'string',
        pattern: '^[a-zA-Z0-9]{1,10}$',
        maxLength: 10,
      },
    },
    required: ['phone'],
  },
};

/** @returns {PageSchema} */
const dateRangePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.name
          ? `Dates you were employed at ${formData.name}`
          : 'Dates you were employed',
    ),
    dateRange: currentOrPastDateRangeUI(
      'Employment start date',
      'Employment end date',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      dateRange: currentOrPastDateRangeSchema,
    },
    required: ['dateRange'],
  },
};

/** @returns {PageSchema} */
const reasonForLeavingPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.name
          ? `Reason for leaving ${formData.name}`
          : 'Reason for leaving',
    ),
    reasonForLeaving: textareaUI('Explain why you left this employer.'),
  },
  schema: {
    type: 'object',
    properties: {
      reasonForLeaving: textareaSchema,
    },
    required: ['reasonForLeaving'],
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
      arrayBuilderOptions,
      {},
      {
        labelHeaderLevel: 'p',
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

const employersPages = arrayBuilderPages(arrayBuilderOptions, pageBuilder => ({
  employers: pageBuilder.introPage({
    title: 'Employers',
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
    title: 'Employer address and phone number',
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
  employerReasonForLeavingPage: pageBuilder.itemPage({
    title: 'Reason for leaving employer',
    path: 'employers/:index/reason-for-leaving',
    uiSchema: reasonForLeavingPage.uiSchema,
    schema: reasonForLeavingPage.schema,
  }),
}));

export default employersPages;
