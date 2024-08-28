import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import VaCheckboxField from '~/platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastMonthYearDateRangeSchema,
  currentOrPastMonthYearDateRangeUI,
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
    (!item?.currentlyServing && !item?.characterOfDischarge) ||
    (!item?.currentlyServing &&
      requireExplanation(item?.characterOfDischarge) &&
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
    dateRange: currentOrPastMonthYearDateRangeUI(
      {
        title: 'Service start date',
        hint: 'For example: January 2000',
      },
      {
        title: 'Service end date',
        hint: 'For example: January 2000',
        hideIf: (formData, index) =>
          formData?.militaryServiceExperiences?.[index]?.currentlyServing,
        required: (formData, index) =>
          !formData?.militaryServiceExperiences?.[index]?.currentlyServing,
      },
    ),
    'view:dateRangeEndDateLabel': {
      'ui:description': 'Service end date',
      'ui:options': {
        hideIf: (formData, index) =>
          !formData?.militaryServiceExperiences?.[index]?.currentlyServing,
      },
    },
    currentlyServing: {
      'ui:title': 'I am currently serving in this military service experience.',
      'ui:webComponentField': VaCheckboxField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      branch: selectSchema(branchOptions),
      dateRange: {
        ...currentOrPastMonthYearDateRangeSchema,
        required: ['from'],
      },
      'view:dateRangeEndDateLabel': {
        type: 'object',
        properties: {},
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
    characterOfDischarge: selectUI({
      title: 'Character of discharge',
      required: (formData, index) =>
        !formData?.militaryServiceExperiences?.[index]?.currentlyServing,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      characterOfDischarge: selectSchema(characterOfDischargeOptions),
    },
  },
};

/** @returns {PageSchema} */
const explanationOfDischargePage = {
  uiSchema: {
    explanationOfDischarge: textareaUI({
      title: 'Explain the nature of your discharge.',
      required: (formData, index) =>
        !formData?.militaryServiceExperiences?.[index]?.currentlyServing &&
        requireExplanation(
          formData?.militaryServiceExperiences?.[index]?.characterOfDischarge,
        ),
    }),
  },
  schema: {
    type: 'object',
    properties: {
      explanationOfDischarge: textareaSchema,
    },
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
  (pageBuilder, helpers) => ({
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
      onNavForward: props => {
        return !props.formData.currentlyServing
          ? helpers.navForwardKeepUrlParams(props)
          : helpers.navForwardFinishedItem(props);
      },
      uiSchema: branchAndDateRangePage.uiSchema,
      schema: branchAndDateRangePage.schema,
    }),
    militaryServiceExperienceCharacterOfDischargePage: pageBuilder.itemPage({
      title: 'Military service experience character of discharge',
      path: 'military-service-experiences/:index/discharge-character',
      onNavForward: props => {
        return requireExplanation(props.formData.characterOfDischarge)
          ? helpers.navForwardKeepUrlParams(props)
          : helpers.navForwardFinishedItem(props);
      },
      uiSchema: characterOfDischargePage.uiSchema,
      schema: characterOfDischargePage.schema,
    }),
    militaryServiceExperienceExplanationOfDischargePage: pageBuilder.itemPage({
      title: 'Military service experience explanation of discharge',
      path: 'military-service-experiences/:index/discharge-explanation',
      uiSchema: explanationOfDischargePage.uiSchema,
      schema: explanationOfDischargePage.schema,
    }),
  }),
);

export default militaryServiceExperiencesPages;
