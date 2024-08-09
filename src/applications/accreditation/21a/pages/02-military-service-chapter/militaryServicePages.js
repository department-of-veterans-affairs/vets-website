import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  descriptionUI,
  selectSchema,
  selectUI,
  textareaSchema,
  textareaUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import MilitaryServiceIntro from '../../components/02-military-service-chapter/MilitaryServiceIntro';
import { formatReviewDate } from '../helpers/formatReviewDate';

const branchOptions = [
  'Army',
  'Navy',
  'Air Force',
  'Marine Corps',
  'Space Force',
  'Coast Guard',
];

const characterOfDischargeOptions = [
  'Honorable',
  'General',
  'Other Than Honorable',
  'Bad Conduct',
  'Dishonorable',
  'Other',
];

const explanationRequired = [
  'Other Than Honorable',
  'Bad Conduct',
  'Dishonorable',
  'Other',
];

const requireExplanation = characterOfDischarge =>
  explanationRequired.includes(characterOfDischarge);

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'militaryServiceExperiences',
  nounSingular: 'military service experience',
  nounPlural: 'military service experiences',
  required: false,
  isItemIncomplete: item =>
    !item?.branch ||
    !item?.dateRange ||
    !item?.characterOfDischarge ||
    (requireExplanation(item?.characterOfDischarge) &&
      !item?.explanationOfDischarge),
  text: {
    getItemName: item => item?.branch,
    cardDescription: item =>
      `${formatReviewDate(item?.dateRange?.from)} - ${formatReviewDate(
        item?.dateRange?.to,
      )}`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...descriptionUI(MilitaryServiceIntro),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const militaryServiceExperiencePage = {
  uiSchema: {
    ...titleUI(
      'Military service experience',
      'You will have the option of adding additional periods of service on the next page.',
    ),
    branch: selectUI('Branch of service'),
    dateRange: currentOrPastDateRangeUI(
      {
        title: 'Active service start date',
      },
      {
        title: 'Active service end date',
        hint:
          'Your active service end data is also known as your separation and can be found in the record of service section of your DD214. If your service is or was in National Guard or Reserves, your active service end date could be a different date from when your contract or service obligation ends.',
      },
    ),
    characterOfDischarge: selectUI('Character of discharge'),
    explanationOfDischarge: textareaUI({
      title: 'Explanation of discharge',
      expandUnder: 'characterOfDischarge',
      expandUnderCondition: requireExplanation,
      required: (formData, index) =>
        requireExplanation(
          formData?.militaryServiceExperiences?.[index]?.characterOfDischarge,
        ),
    }),
  },
  schema: {
    type: 'object',
    properties: {
      branch: selectSchema(branchOptions),
      dateRange: currentOrPastDateRangeSchema,
      characterOfDischarge: selectSchema(characterOfDischargeOptions),
      explanationOfDischarge: textareaSchema,
    },
    required: ['branch', 'dateRange', 'characterOfDischarge'],
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
