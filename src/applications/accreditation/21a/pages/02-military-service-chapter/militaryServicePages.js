import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import VaCheckboxField from '~/platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  descriptionUI,
  selectSchema,
  selectUI,
  textareaSchema,
  textareaUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import MilitaryServiceIntro from '../../components/02-military-service-chapter/MilitaryServiceIntro';
import { formatReviewDate } from '../helpers/formatReviewDate';

const serviceBranchOptions = [
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

const isCurrentlyServing = (formData, index) => {
  return formData?.militaryServiceExperiences?.[index]?.currentlyServing;
};

/** @returns {PageSchema} */
const branchAndDateRangePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Military service experience',
      description:
        'List all periods of military service experience. You will be able to add additional periods of service on subsequent screens.',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    branch: selectUI('Branch of service'),
    dateRange: currentOrPastDateRangeUI(
      { title: 'Service start date' },
      {
        title: 'Service end date',
        hideIf: (formData, index) => isCurrentlyServing(formData, index),
        required: (formData, index) => !isCurrentlyServing(formData, index),
      },
    ),
    currentlyServing: {
      'ui:required': false,
      'ui:title': 'I am currently in the military.',
      'ui:webComponentField': VaCheckboxField,
      'ui:options': {
        hideEmptyValueInReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      branch: selectSchema(serviceBranchOptions),
      dateRange: currentOrPastDateRangeSchema,
      currentlyServing: {
        type: 'boolean',
      },
    },
    required: ['branch', 'dateRange'],
  },
};

/** @returns {PageSchema} */
const characterOfDischargePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.branch
          ? `${formData.branch} character of discharge`
          : 'Character of discharge',
    ),
    characterOfDischarge: selectUI('Character of discharge'),
  },
  schema: {
    type: 'object',
    properties: {
      characterOfDischarge: selectSchema(characterOfDischargeOptions),
    },
    required: ['characterOfDischarge'],
  },
};

/** @returns {PageSchema} */
const explanationOfDischargePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.branch
          ? `${formData.branch} explanation of discharge`
          : 'Explanation of discharge',
    ),
    explanationOfDischarge: textareaUI('Explain the nature of your discharge.'),
  },
  schema: {
    type: 'object',
    properties: {
      explanationOfDischarge: textareaSchema,
    },
    required: ['explanationOfDischarge'],
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
    militaryServiceExperienceBranchDateRangePage: pageBuilder.itemPage({
      title: 'Military service experience branch and date range',
      path: 'military-service-experiences/:index/branch-date-range',
      uiSchema: branchAndDateRangePage.uiSchema,
      schema: branchAndDateRangePage.schema,
    }),
    militaryServiceExperienceCharacterOfDischargePage: pageBuilder.itemPage({
      title: 'Military service experience character of discharge',
      path: 'military-service-experiences/:index/character-of-discharge',
      uiSchema: characterOfDischargePage.uiSchema,
      schema: characterOfDischargePage.schema,
    }),
    militaryServiceExperienceExplanationOfDischargePage: pageBuilder.itemPage({
      title: 'Military service experience explanation of discharge',
      path: 'military-service-experiences/:index/explanation-of-discharge',
      depends: (formData, index) =>
        requireExplanation(
          formData?.militaryServiceExperiences?.[index]?.characterOfDischarge,
        ),
      uiSchema: explanationOfDischargePage.uiSchema,
      schema: explanationOfDischargePage.schema,
    }),
  }),
);

export default militaryServiceExperiencesPages;
