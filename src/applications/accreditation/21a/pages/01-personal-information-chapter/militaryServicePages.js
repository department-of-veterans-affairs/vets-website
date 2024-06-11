import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  descriptionUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import MilitaryServiceExperienceNote from '../../components/MilitaryServiceExperienceNote';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'military-service-experiences',
  nounSingular: 'Military service experience',
  nounPlural: 'Military service experiences',
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
      hint:
        'If yes then you will add your military service experiences on the following page.',
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

/** @returns {PageSchema} */
const militaryServiceExperience = {
  uiSchema: {
    ...titleUI('Military service experience'),
    ...descriptionUI('Please add your military service history details below.'),
    militaryServiceExperienceBranchOfService: {
      'ui:title': 'Branch of service',
      'ui:webComponentField': VaSelectField,
    },
    militaryServiceExperienceDateRange: currentOrPastDateRangeUI(
      'Active service start date',
      'Active service end date',
      'End of service must be after start of service',
    ),
    militaryServiceExperienceCharacterOfDischarge: {
      'ui:title': 'Character of discharge',
      'ui:webComponentField': VaSelectField,
    },
    'view:militaryServiceExperienceNote': {
      'ui:title': ' ',
      'ui:field': MilitaryServiceExperienceNote,
    },
  },
  schema: {
    type: 'object',
    required: [
      'militaryServiceExperienceBranchOfService',
      'militaryServiceExperienceDateRange',
      'militaryServiceExperienceCharacterOfDischarge',
    ],
    properties: {
      militaryServiceExperienceBranchOfService: {
        type: 'string',
        enum: [
          'Army',
          'Navy',
          'Air Force',
          'Marine Corps',
          'Space Force',
          'Coast Guard',
        ],
      },
      militaryServiceExperienceDateRange: currentOrPastDateRangeSchema,
      militaryServiceExperienceCharacterOfDischarge: {
        type: 'string',
        enum: ['Honorable', 'Other'],
      },
      'view:militaryServiceExperienceNote': {
        type: 'string',
      },
    },
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
