import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  addressSchema,
  addressUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  descriptionUI,
  selectSchema,
  selectUI,
  textareaSchema,
  textareaUI,
  textSchema,
  textUI,
  yesNoSchema,
  yesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import EducationHistoryIntro from '../../components/04-education-history-chapter/EducationHistoryIntro';
import { degreeOptions } from '../../constants/options';
import { createDateRangeText } from '../helpers/createDateRangeText';
import { createName } from '../helpers/createName';
import {
  dateRangeWithCurrentCheckboxSchema,
  dateRangeWithCurrentCheckboxUI,
} from '../helpers/dateRangeWithCurrentCheckboxPattern';

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'educationalInstitutions',
  nounSingular: 'educational institution',
  nounPlural: 'educational institutions',
  required: true,
  isItemIncomplete: item =>
    !item?.name ||
    !item?.dateRange?.from ||
    (!item?.dateRange?.to && !item?.currentlyEnrolled) ||
    item?.degreeReceived === undefined ||
    (item?.degreeReceived === true && !item?.degree) ||
    (item?.degreeReceived === false && !item?.reasonForNotCompleting),
  text: {
    getItemName: item => item?.name,
    cardDescription: item => createDateRangeText(item, 'currentlyEnrolled'),
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...descriptionUI(EducationHistoryIntro),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const institutionAndDegreePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Institution and degree information',
      description:
        'List your education history starting with high school. Include all the colleges and universities attended and degrees received. You will be able to add additional schools on subsequent screens.',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    name: textUI('Name of school'),
    ...dateRangeWithCurrentCheckboxUI({
      fromLabel: 'Start date',
      toLabel: 'End date',
      currentLabel: 'I still go to school here.',
      currentKey: 'currentlyEnrolled',
      isCurrentChecked: (formData, index) =>
        formData?.educationalInstitutions?.[index]?.currentlyEnrolled,
    }),
    degreeReceived: yesNoUI('Degree received?'),
    major: textUI('Major'),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
      ...dateRangeWithCurrentCheckboxSchema('currentlyEnrolled'),
      degreeReceived: yesNoSchema,
      major: textSchema,
    },
    required: ['name', 'dateRange', 'degreeReceived'],
  },
};

/** @returns {PageSchema} */
const degreeInformationPage = {
  uiSchema: {
    degree: selectUI({
      title: 'Type of degree',
      hideIf: (formData, index) =>
        !formData?.educationalInstitutions?.[index]?.degreeReceived,
      required: (formData, index) =>
        formData?.educationalInstitutions?.[index]?.degreeReceived,
    }),
    reasonForNotCompleting: textareaUI({
      title: 'Explain why you did not complete this degree.',
      hideIf: (formData, index) =>
        !formData?.educationalInstitutions?.[index]?.degreeReceived === false,
      required: (formData, index) =>
        formData?.educationalInstitutions?.[index]?.degreeReceived === false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      degree: selectSchema(degreeOptions),
      reasonForNotCompleting: textareaSchema,
    },
  },
};

/** @returns {PageSchema} */
const addressPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${createName({
          firstName: formData?.name,
          fallback: 'Institution',
        })} address`,
    ),
    address: addressUI({
      labels: {
        militaryCheckbox:
          'Institution is on a United States military base outside of the U.S.',
      },
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema({
        omit: ['street3'],
      }),
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
    'view:hasEducationalInstitutions': arrayBuilderYesNoUI(
      arrayBuilderOptions,
      {},
      {
        labelHeaderLevel: 'p',
        hint: 'Include all education history since high school.',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEducationalInstitutions': arrayBuilderYesNoSchema,
    },
    required: ['view:hasEducationalInstitutions'],
  },
};

const educationalInstitutionsPages = arrayBuilderPages(
  arrayBuilderOptions,
  pageBuilder => ({
    educationalInstitutions: pageBuilder.introPage({
      title: 'Education history intro',
      path: 'education-history-intro',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    educationalInstitutionsSummary: pageBuilder.summaryPage({
      title: 'Review educational institutions',
      path: 'educational-institutions-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    educationalInstitutionInstitutionAndDegreePage: pageBuilder.itemPage({
      title: 'Educational institution institution and degree information',
      path: 'educational-institutions/:index/institution-degree-information',
      uiSchema: institutionAndDegreePage.uiSchema,
      schema: institutionAndDegreePage.schema,
    }),
    educationalInstitutionDegreeInformationPage: pageBuilder.itemPage({
      title: 'Educational institution degree information',
      path: 'educational-institutions/:index/degree-information',
      uiSchema: degreeInformationPage.uiSchema,
      schema: degreeInformationPage.schema,
    }),
    educationalInstitutionAddressPage: pageBuilder.itemPage({
      title: 'Educational institution address',
      path: 'educational-institutions/:index/address',
      uiSchema: addressPage.uiSchema,
      schema: addressPage.schema,
    }),
  }),
);

export default educationalInstitutionsPages;
