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

import content from '../../locales/en/content.json';

import MilitaryServiceIntro from '../../components/02-military-service-chapter/MilitaryServiceIntro';
import {
  branchOptions,
  characterOfDischargeOptions,
  explanationRequired,
} from '../../constants/options';
import { createDateRangeText } from '../helpers/createDateRangeText';
import {
  dateRangeWithCurrentCheckboxSchema,
  dateRangeWithCurrentCheckboxUI,
} from '../helpers/dateRangeWithCurrentCheckboxPattern';

const requireExplanation = characterOfDischarge =>
  explanationRequired.includes(characterOfDischarge);

/** @type {ArrayBuilderOptions} */
export const arrayBuilderOptions = {
  arrayPath: 'militaryServiceExperiences',
  nounSingular: 'military service experience',
  nounPlural: 'military service experiences',
  summaryTitle: () => 'Review your military service experiences',
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
    yesNoBlankReviewQuestion: () => content['military-service-question'],
    reviewAddButtonText: () => content['military-service-add-button-text'],
    getItemName: item => item?.branch,
    cardDescription: item => createDateRangeText(item, 'currentlyServing'),
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
      isCurrentChecked: (formData, index, fullData) => {
        // Adding a check for formData and fullData since formData is sometimes undefined on load
        // and we cant rely on fullData for testing
        const militaryServiceExperiences =
          formData.militaryServiceExperiences ??
          fullData.militaryServiceExperiences;
        const militaryServiceExperience = militaryServiceExperiences?.[index];
        return militaryServiceExperience?.currentlyServing === true;
      },
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
      // TODO: use depends: (formData, index) instead on the dynamic page.
      onNavForward: props => {
        const item =
          props.formData?.[arrayBuilderOptions.arrayPath]?.[props.index];
        return !item?.currentlyServing
          ? helpers.navForwardKeepUrlParams(props)
          : helpers.navForwardFinishedItem(props);
      },
      uiSchema: branchAndDateRangePage.uiSchema,
      schema: branchAndDateRangePage.schema,
    }),
    militaryServiceExperienceCharacterOfDischargePage: pageBuilder.itemPage({
      title: 'Military service experience character of discharge',
      path: 'military-service-experiences/:index/discharge-character',
      // TODO: use depends: (formData, index) instead on the dynamic page.
      onNavForward: props => {
        return requireExplanation(
          props.formData?.[arrayBuilderOptions.arrayPath]?.[props.index]
            ?.characterOfDischarge,
        )
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
