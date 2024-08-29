import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  addressSchema,
  addressUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  checkboxGroupSchema,
  checkboxGroupUI,
  descriptionUI,
  textareaSchema,
  textareaUI,
  textSchema,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { createDateRangeText } from '../helpers/createDateRangeText';
import { createName } from '../helpers/createName';
import {
  dateRangeWithCurrentCheckboxSchema,
  dateRangeWithCurrentCheckboxUI,
} from '../helpers/dateRangeWithCurrentCheckboxPattern';
import {
  internationalPhoneSchema,
  internationalPhoneUI,
} from '../helpers/internationalPhonePatterns';

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
    cardDescription: item =>
      `${createDateRangeText(item, 'currentlyEmployed')}${
        item?.primaryWorkAddress?.selected ? '; Primary work address' : ''
      }`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...descriptionUI(
      'You will now list your employment information for the past ten years. You may start with your current employer. You will be able to add additional employers on subsequent screens.',
    ),
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

const hasPreviouslySelectedPrimary = (formData, currentItemIndex) => {
  return formData?.employers?.some(
    (employer, index) =>
      currentItemIndex === index
        ? false
        : employer?.primaryWorkAddress?.selected,
  );
};

/** @returns {PageSchema} */
const addressPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${createName({
          firstName: formData?.name,
          fallback: 'Employer',
        })} address`,
    ),
    address: addressUI({
      labels: {
        militaryCheckbox:
          'I work on a United States military base outside of the U.S.',
      },
      omit: ['street3'],
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
      primaryWorkAddress: checkboxGroupSchema(['selected']),
    },
  },
};

/** @returns {PageSchema} */
const phoneNumberPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${createName({
          firstName: formData?.name,
          fallback: 'Employer',
        })} phone number`,
    ),
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
  },
  schema: {
    type: 'object',
    properties: {
      phone: internationalPhoneSchema,
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
        `Dates you were employed at ${createName({
          firstName: formData?.name,
          fallback: 'Employer',
          isPossessive: false,
        })}`,
    ),
    ...dateRangeWithCurrentCheckboxUI({
      fromLabel: 'Employment start date',
      toLabel: 'Employment end date',
      currentLabel: 'I still work here.',
      currentKey: 'currentlyEmployed',
      isCurrentChecked: (formData, index) =>
        formData?.employers?.[index]?.currentlyEmployed,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      ...dateRangeWithCurrentCheckboxSchema('currentlyEmployed'),
    },
  },
};

/** @returns {PageSchema} */
const reasonForLeavingPage = {
  uiSchema: {
    reasonForLeaving: textareaUI({
      title: 'Explain why you left this employer.',
      required: (formData, index) =>
        !formData?.employers?.[index]?.currentlyEmployed,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      reasonForLeaving: textareaSchema,
    },
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
    employerAddressPage: pageBuilder.itemPage({
      title: 'Employer address',
      path: 'employers/:index/address',
      uiSchema: addressPage.uiSchema,
      schema: addressPage.schema,
    }),
    employerPhoneNumberPage: pageBuilder.itemPage({
      title: 'Employer phone number',
      path: 'employers/:index/phone-number',
      uiSchema: phoneNumberPage.uiSchema,
      schema: phoneNumberPage.schema,
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
