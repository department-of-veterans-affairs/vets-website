import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
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
import { formatReviewDate } from '../helpers/formatReviewDate';

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'educationalInstitutions',
  nounSingular: 'educational institution',
  nounPlural: 'educational institutions',
  required: true,
  isItemIncomplete: item =>
    !item?.name ||
    !item?.dateRange ||
    item?.degreeReceived === undefined ||
    (item?.degreeReceived === true && !item?.degree) ||
    (item?.degreeReceived === false && !item?.reasonForNotCompleting) ||
    (item?.degreeReceived !== false && !item?.major),
  text: {
    getItemName: item => item?.name,
    cardDescription: item =>
      `${formatReviewDate(item?.dateRange?.from)} - ${formatReviewDate(
        item?.dateRange?.to,
      )}`,
  },
};

const degreeOptions = [
  'Did not receive a degree',
  'Associate of Arts',
  'Bachelor of Arts',
  'Bachelor of Science',
  'Master of Science',
  'Master of Arts',
  'Juris Doctor',
  'Other',
];

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
const educationalInstitutionPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Institution and degree information',
      description:
        'Enter your education institutions starting with high school. List all the colleges and universities attended and degrees received. You will be able to add additional education institutions on the next screen.',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    name: textUI('Name of school'),
    dateRange: currentOrPastDateRangeUI('Start date', 'End date'),
    degreeReceived: yesNoUI('Degree received?'),
    degree: selectUI({
      title: 'Degree',
      expandUnder: 'degreeReceived',
      required: (formData, index) =>
        formData?.educationalInstitutions?.[index]?.degreeReceived === true, // TODO: Required is not working correctly on edi
    }),
    reasonForNotCompleting: textareaUI({
      title: 'Reason for not completing studies',
      expandUnder: 'degreeReceived',
      expandUnderCondition: degreeReceived => degreeReceived === false,
      required: (formData, index) =>
        formData?.educationalInstitutions?.[index]?.degreeReceived === false, // TODO: Required is not working correctly on edit
    }),
    major: textUI({
      title: 'Major',
      required: (formData, index) =>
        formData?.educationalInstitutions?.[index]?.degreeReceived !== false, // TODO: Required is not working correctly on edit
    }),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
      dateRange: currentOrPastDateRangeSchema,
      degreeReceived: yesNoSchema,
      degree: selectSchema(degreeOptions),
      reasonForNotCompleting: textareaSchema,
      major: textSchema,
    },
    required: ['name', 'dateRange', 'degreeReceived'],
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
      title: 'Educational institutions',
      path: 'educational-institutions',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    educationalInstitutionsSummary: pageBuilder.summaryPage({
      title: 'Review educational institutions',
      path: 'educational-institutions-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    educationalInstitutionPage: pageBuilder.itemPage({
      title: 'Educational institution',
      path: 'educational-institutions/:index/educational-institution',
      uiSchema: educationalInstitutionPage.uiSchema,
      schema: educationalInstitutionPage.schema,
    }),
  }),
);

export default educationalInstitutionsPages;
