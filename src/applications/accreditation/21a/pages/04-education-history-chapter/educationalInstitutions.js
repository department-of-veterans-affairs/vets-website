import { formatReviewDate } from '~/platform/forms-system/src/js/helpers';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  textSchema,
  textUI,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import YourEducationHistoryDescription from '../../components/YourEducationHistoryDescription';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'educationalInstitutions',
  nounSingular: 'educational institution',
  nounPlural: 'educational institutions',
  required: true,
  isItemIncomplete: item =>
    !item?.name ||
    !item.dateRange ||
    !item.receivedDegree ||
    (item.receivedDegree && !item.degree) ||
    (!item.receivedDegree && !item.reasonDidNotReceiveDegree) ||
    !item.major,
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
    ...titleUI('Your education history', YourEducationHistoryDescription),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const educationalInstitutionPage = {
  uiSchema: {
    ...titleUI(
      'Education history',
      'Enter your education history starting with high school. List all the colleges and universities attended and degrees received.',
    ),
    name: textUI('Name of institution'),
    dateRange: currentOrPastDateRangeUI('Start date', 'End date'),
    receivedDegree: yesNoUI('Did you receive a degree?'),
    degree: {
      ...textUI('Type of degree received'),
      'ui:options': {
        expandUnder: 'receivedDegree',
        expandUnderCondition: true,
      },
      'ui:required': formData => !formData.receivedDegree,
    },
    reasonDidNotReceiveDegree: {
      ...textUI('Reason not received'),
      'ui:options': {
        expandUnder: 'receivedDegree',
        expandUnderCondition: false,
      },
      'ui:required': formData => formData.receivedDegree,
    },
    major: textUI('Major'),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
      dateRange: currentOrPastDateRangeSchema,
      receivedDegree: yesNoSchema,
      degree: textSchema,
      reasonDidNotReceiveDegree: textSchema,
      major: textSchema,
    },
    required: ['name', 'dateRange', 'receivedDegree', 'major'],
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
    'view:hasEducationalInstitutions': arrayBuilderYesNoUI(options),
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
  options,
  pageBuilder => ({
    educationalInstitutions: pageBuilder.introPage({
      title: 'educational institutions',
      path: 'educational-institutions',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    educationalInstitutionsSummary: pageBuilder.summaryPage({
      title: 'Review your educational institutions',
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
