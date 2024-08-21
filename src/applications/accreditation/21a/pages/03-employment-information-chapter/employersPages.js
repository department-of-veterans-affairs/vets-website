import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import VaCheckboxField from '~/platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  addressSchema,
  addressUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  checkboxGroupSchema,
  checkboxGroupUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  descriptionUI,
  textareaSchema,
  textareaUI,
  textSchema,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import EmployersIntro from '../../components/03-employment-information-chapter/EmployersIntro';
import { createName } from '../helpers/createName';
import { formatReviewDate } from '../helpers/formatReviewDate';
import {
  internationalPhoneSchema,
  internationalPhoneUI,
} from '../helpers/internationalPhonePatterns';

const getDateRange = item => {
  return `${formatReviewDate(item?.dateRange?.from)} - ${
    item?.currentlyEmployed ? 'Present' : formatReviewDate(item?.dateRange?.to)
  }${item?.primaryWorkAddress?.selected ? '; Primary work address' : ''}`;
};

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
    !item?.dateRange?.from ||
    (!item?.dateRange?.to && !item?.currentlyEmployed) ||
    (!item?.currentlyEmployed && !item?.reasonForLeaving),
  text: {
    getItemName: item => item?.name,
    cardDescription: item => getDateRange(item),
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...descriptionUI(EmployersIntro),
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
      description:
        'List your employment information for the past ten years. You may start with your current employer. You will be able to add additional employers on subsequent screens.',
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

const hasPreviouslySelectedPrimary = (formData, currentItemIndex) => {
  return formData?.employers?.some(
    (employer, index) =>
      currentItemIndex === index
        ? false
        : employer?.primaryWorkAddress?.selected,
  );
};

/** @returns {PageSchema} */
const addressAndPhoneNumberPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${createName({
          firstName: formData?.name,
          fallback: 'Employer',
        })} address and phone number`,
    ),
    address: addressUI({
      labels: {
        militaryCheckbox:
          'I work on a United States military base outside of the U.S.',
      },
      omit: ['street3'],
    }),
    phone: internationalPhoneUI({
      hint: 'Enter with dashes and no spaces. For example: 206-555-0100',
    }),
    extension: textUI({
      title: 'Extension',
      width: 'sm',
      errorMessages: {
        pattern: 'Enter an extension with only numbers and letters',
      },
    }),
    primaryWorkAddress: checkboxGroupUI({
      title: 'Primary work address',
      hint: 'You may only select this for one employer address.',
      hideIf: (formData, index) =>
        hasPreviouslySelectedPrimary(formData, index),
      required: false,
      labels: {
        selected:
          'This is the work address I want OGC to keep on file as my primary work address.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema({
        omit: ['street3'],
      }),
      phone: internationalPhoneSchema,
      extension: {
        type: 'string',
        pattern: '^[a-zA-Z0-9]{1,10}$',
        maxLength: 10,
      },
      primaryWorkAddress: checkboxGroupSchema(['selected']),
    },
    required: ['phone'],
  },
};

/** @returns {PageSchema} */
const dateRangePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Dates you were employed at ${createName({
          firstName: formData?.name,
          fallback: 'Employer',
          isPossessive: false,
        })}`,
    ),
    dateRange: currentOrPastDateRangeUI(
      { title: 'Employment start date' },
      {
        title: 'Employment end date',
        hideIf: (formData, index) =>
          formData?.employers?.[index]?.currentlyEmployed,
        required: (formData, index) =>
          !formData?.employers?.[index]?.currentlyEmployed,
      },
    ),
    'view:dateRangeEndDateLabel': {
      'ui:description': 'Employment end date',
      'ui:options': {
        hideIf: (formData, index) =>
          !formData?.employers?.[index]?.currentlyEmployed,
      },
    },
    currentlyEmployed: {
      'ui:title': 'I still work here.',
      'ui:webComponentField': VaCheckboxField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      dateRange: currentOrPastDateRangeSchema,
      'view:dateRangeEndDateLabel': {
        type: 'object',
        properties: {},
      },
      currentlyEmployed: {
        type: 'boolean',
      },
    },
  },
};

/** @returns {PageSchema} */
const reasonForLeavingPage = {
  uiSchema: {
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
        hint:
          'Include your employment information for the past ten years or since the age of 18, whichever period is shorter. Also, include any employment related to Veterans’ benefits, to include educational services and consulting, regardless of when this employment took place.',
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

const employersPages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
    employers: pageBuilder.introPage({
      title: 'Employment information intro',
      path: 'Employment information intro',
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
      onNavForward: props => {
        return !props.formData.currentlyEmployed
          ? helpers.navForwardKeepUrlParams(props)
          : helpers.navForwardFinishedItem(props);
      },
      uiSchema: dateRangePage.uiSchema,
      schema: dateRangePage.schema,
    }),
    employerReasonForLeavingPage: pageBuilder.itemPage({
      title: 'Reason for leaving employer',
      path: 'employers/:index/reason-for-leaving',
      uiSchema: reasonForLeavingPage.uiSchema,
      schema: reasonForLeavingPage.schema,
    }),
  }),
);

export default employersPages;
