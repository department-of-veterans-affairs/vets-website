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
import {
  branchOptions,
  characterOfDischargeOptions,
  explanationRequired,
} from '../../constants/options';
import { formatReviewDate } from '../helpers/formatReviewDate';

const getDateRange = item => {
  return `${formatReviewDate(item?.dateRange?.from)} - ${
    item?.currentlyServing ? 'Present' : formatReviewDate(item?.dateRange?.to)
  }`;
};

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
    !item?.dateRange?.from ||
    (!item?.dateRange?.to && !item?.currentlyServing) ||
    !item?.characterOfDischarge ||
    (requireExplanation(item?.characterOfDischarge) &&
      !item?.explanationOfDischarge),
  text: {
    getItemName: item => item?.branch,
    cardDescription: item => getDateRange(item),
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
        hideIf: (formData, index) =>
          formData?.militaryServiceExperiences?.[index]?.currentlyServing,
      },
    ),
    currentlyServing: {
      'ui:required': false,
      'ui:title': 'I am currently in the military.',
      'ui:webComponentField': VaCheckboxField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      branch: selectSchema(branchOptions),
      dateRange: {
        ...currentOrPastDateRangeSchema,
        required: ['from'],
      },
      currentlyServing: {
        type: 'boolean',
      },
    },
    required: ['branch'],
  },
};

/** @returns {PageSchema} */
const characterOfDischargePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.branch && formData?.dateRange
          ? `${formData?.branch} (${getDateRange(
              formData,
            )}) character of discharge`
          : 'Character of discharge',
    ),
    characterOfDischarge: selectUI('Character of discharge'),
    explanationOfDischarge: textareaUI({
      title: 'Explain the nature of your discharge.',
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
      characterOfDischarge: selectSchema(characterOfDischargeOptions),
      explanationOfDischarge: textareaSchema,
    },
    required: ['characterOfDischarge'],
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
        hint: 'Include all periods of military service.',
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
      title: 'Military service history intro',
      path: 'military-service-history-intro',
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
      path: 'military-service-experiences/:index/discharge',
      uiSchema: characterOfDischargePage.uiSchema,
      schema: characterOfDischargePage.schema,
    }),
  }),
);

export default militaryServiceExperiencesPages;
