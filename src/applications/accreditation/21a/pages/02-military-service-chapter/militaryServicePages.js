import { formatReviewDate } from '~/platform/forms-system/src/js/helpers';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  selectSchema,
  selectUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import MilitaryServiceExperienceNote from '../../components/02-military-service-chapter/MilitaryServiceExperienceNote';

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'militaryServiceExperiences',
  nounSingular: 'military service experience',
  nounPlural: 'military service experiences',
  required: false,
  isItemIncomplete: item =>
    !item?.serviceBranch ||
    !item?.serviceDateRange ||
    !item?.characterOfDischarge,
  text: {
    getItemName: item => item.serviceBranch,
    cardDescription: item =>
      `${formatReviewDate(item?.serviceDateRange?.from)} - ${formatReviewDate(
        item?.serviceDateRange?.to,
      )}`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      'Your service history',
      'If you have served in the military, we will ask you about your service history over the next couple of pages.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

const serviceBranchOptions = [
  'Army',
  'Navy',
  'Air Force',
  'Marine Corps',
  'Space Force',
  'Coast Guard',
];

const characterOfDischargeOptions = ['Honorable', 'Other'];

/** @returns {PageSchema} */
const militaryServiceExperiencePage = {
  uiSchema: {
    ...titleUI(
      'Military service experience',
      'Please add your military service history details below.',
    ),
    serviceBranch: selectUI('Branch of service'),
    serviceDateRange: currentOrPastDateRangeUI(
      'Active service start date',
      'Active service end date',
    ),
    characterOfDischarge: selectUI('Character of discharge'),
    'view:militaryServiceExperienceNote': {
      'ui:description': MilitaryServiceExperienceNote,
    },
  },
  schema: {
    type: 'object',
    properties: {
      serviceBranch: selectSchema(serviceBranchOptions),
      serviceDateRange: currentOrPastDateRangeSchema,
      characterOfDischarge: selectSchema(characterOfDischargeOptions),
      'view:militaryServiceExperienceNote': {
        type: 'object',
        properties: {},
      },
    },
    required: ['serviceBranch', 'serviceDateRange', 'characterOfDischarge'],
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAVeteran': arrayBuilderYesNoUI(
      arrayBuilderOptions,
      {
        title: 'Have you ever served in the military?',
        labelHeaderLevel: 'p',
        hint: ' ',
      },
      {
        labelHeaderLevel: 'p',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAVeteran': arrayBuilderYesNoSchema,
    },
    required: ['view:isAVeteran'],
  },
};

const militaryServiceExperiencesPages = arrayBuilderPages(
  arrayBuilderOptions,
  pageBuilder => ({
    militaryServicesExperiences: pageBuilder.introPage({
      title: 'Military service experiences',
      path: 'military-service-experiences',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    militaryServiceExperiencesSummary: pageBuilder.summaryPage({
      title: 'Review your military service experiences',
      path: 'military-service-experiences-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    militaryServiceExperiencePage: pageBuilder.itemPage({
      title: 'Military service experience',
      path: 'military-service-experiences/:index/experience',
      uiSchema: militaryServiceExperiencePage.uiSchema,
      schema: militaryServiceExperiencePage.schema,
    }),
  }),
);

export default militaryServiceExperiencesPages;
