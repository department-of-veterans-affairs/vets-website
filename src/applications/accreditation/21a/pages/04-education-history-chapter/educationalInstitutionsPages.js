import { formatReviewDate } from '~/platform/forms-system/src/js/helpers';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  selectSchema,
  selectUI,
  textSchema,
  textUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import YourEducationHistoryDescription from '../../components/YourEducationHistoryDescription';

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'educationalInstitutions',
  nounSingular: 'educational institution',
  nounPlural: 'educational institutions',
  required: true,
  isItemIncomplete: item =>
    !item?.name || !item.dateRange || !item.degree || !item.major,
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
const educationalInstitutionPage = {
  uiSchema: {
    ...titleUI(
      'Education history',
      'Enter your education history starting with high school. List all the colleges and universities attended and degrees received.',
    ),
    name: textUI('Name of institution'),
    dateRange: currentOrPastDateRangeUI('Start date', 'End date'),
    degree: selectUI('Type of degree received'),
    major: textUI('Major'),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
      dateRange: currentOrPastDateRangeSchema,
      degree: selectSchema(degreeOptions),
      major: textSchema,
    },
    required: ['name', 'dateRange', 'degree', 'major'],
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
    'view:hasEducationalInstitutions': arrayBuilderYesNoUI(arrayBuilderOptions),
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
