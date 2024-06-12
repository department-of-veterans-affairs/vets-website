import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
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

import MilitaryServiceExperienceNote from '../../components/MilitaryServiceExperienceNote';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'military-service-experiences',
  nounSingular: 'military service experience',
  nounPlural: 'military service experiences',
  required: false,
  isItemIncomplete: item =>
    !item?.militaryServiceExperienceBranchOfService ||
    !item.militaryServiceExperienceDateRange ||
    !item.militaryServiceExperienceCharacterOfDischarge,
  text: {
    getItemName: item => item.militaryServiceExperienceBranchOfService,
    cardDescription: item =>
      `${formatReviewDate(
        item?.militaryServiceExperienceDateRange?.from,
      )} - ${formatReviewDate(item?.militaryServiceExperienceDateRange?.to)}`,
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAVeteran': arrayBuilderYesNoUI(options, {
      title: 'Are you a Veteran?',
      hint: ' ',
      labels: {
        Y: 'Yes, I am a Veteran',
        N: 'No, I am a civilian',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAVeteran': arrayBuilderYesNoSchema,
    },
    required: ['view:isAVeteran'],
  },
};

const branchOfServiceOptions = [
  'Army',
  'Navy',
  'Air Force',
  'Marine Corps',
  'Space Force',
  'Coast Guard',
];

const characterOfDischargeOptions = ['Honorable', 'Other'];

/** @returns {PageSchema} */
const militaryServiceExperience = {
  uiSchema: {
    ...titleUI(
      'Military service experience',
      'Please add your military service history details below.',
    ),
    militaryServiceExperienceBranchOfService: selectUI('Branch of service'),
    militaryServiceExperienceDateRange: currentOrPastDateRangeUI(
      'Active service start date',
      'Active service end date',
      'End of service must be after start of service',
    ),
    militaryServiceExperienceCharacterOfDischarge: selectUI(
      'Character of discharge',
    ),
    'view:militaryServiceExperienceNote': {
      'ui:description': MilitaryServiceExperienceNote,
    },
  },
  schema: {
    type: 'object',
    properties: {
      militaryServiceExperienceBranchOfService: selectSchema(
        branchOfServiceOptions,
      ),
      militaryServiceExperienceDateRange: currentOrPastDateRangeSchema,
      militaryServiceExperienceCharacterOfDischarge: selectSchema(
        characterOfDischargeOptions,
      ),
      'view:militaryServiceExperienceNote': {
        type: 'object',
        properties: {},
      },
    },
    required: [
      'militaryServiceExperienceBranchOfService',
      'militaryServiceExperienceDateRange',
      'militaryServiceExperienceCharacterOfDischarge',
    ],
  },
};

const militaryServicePages = arrayBuilderPages(options, pageBuilder => ({
  militaryServiceSummary: pageBuilder.summaryPage({
    title: 'Military service experiences',
    path: 'military-service-experiences',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  militaryServiceExperience: pageBuilder.itemPage({
    title: 'Military service experience',
    path: 'military-service-experiences/:index/experience',
    uiSchema: militaryServiceExperience.uiSchema,
    schema: militaryServiceExperience.schema,
  }),
}));

export default militaryServicePages;
