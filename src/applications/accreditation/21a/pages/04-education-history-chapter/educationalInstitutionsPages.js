import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  descriptionUI,
  textareaUI,
  textareaSchema,
  textSchema,
  textUI,
  yesNoUI,
  yesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

import EducationHistoryIntro from '../../components/04-education-history-chapter/EducationHistoryIntro';
import { formatReviewDate } from '../helpers/formatReviewDate';

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'educationalInstitutions',
  nounSingular: 'educational institution',
  nounPlural: 'educational institutions',
  required: true,
  isItemIncomplete: item => !item?.name || !item.dateRange || !item.received,
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
    ...descriptionUI(
      'Enter your education history starting with high school. List all the colleges and universities attended and degrees received. You will be able to add additional education history on the next screen.',
    ),
    name: textUI('Name of institution'),
    dateRange: currentOrPastDateRangeUI('Start date', 'End date'),
    received: yesNoUI('Degree received?'),
    degree: textUI({
      title: 'Degree',
      expandUnder: 'received',
      required: (formData, index) =>
        formData?.educationalInstitutions?.[index]?.received === true,
    }),
    reason: textareaUI({
      title: 'Reason for not completing studies',
      expandUnder: 'received',
      expandUnderCondition: received => received === false,
      required: (formData, index) =>
        formData?.educationalInstitutions?.[index]?.received === false,
    }),
    major: textUI({
      title: 'Major',
      required: (formData, index) =>
        formData?.educationalInstitutions?.[index]?.received === true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
      dateRange: currentOrPastDateRangeSchema,
      received: yesNoSchema,
      degree: textSchema,
      reason: textareaSchema,
      major: textSchema,
    },
    required: ['name', 'dateRange', 'received'],
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
      title: 'Review education history',
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
