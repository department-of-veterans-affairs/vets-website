import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
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
import {
  dateRangeWithCurrentCheckboxSchema,
  dateRangeWithCurrentCheckboxUI,
} from '../helpers/dateRangeWithCurrentCheckboxPattern';
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
    ...dateRangeWithCurrentCheckboxUI({
      fromLabel: 'Service start date',
      toLabel: 'Service end date',
      currentLabel:
        'I am currently serving in this military service experience.',
      currentKey: 'currentlyServing',
      isCurrentChecked: (formData, index) =>
        formData?.militaryServiceExperiences?.[index]?.currentlyServing,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      branch: selectSchema(branchOptions),
      ...dateRangeWithCurrentCheckboxSchema('currentlyServing'),
    },
    required: ['branch'],
  },
};

/** @returns {PageSchema} */
const characterOfDischargePage = {
  uiSchema: {
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
