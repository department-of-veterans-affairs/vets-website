import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import {
  VA_CONDITIONS_URL,
  VA_LOCATION_URL,
  VA_PROMPT_URL,
  HAS_VA_EVIDENCE,
  VA_SUMMARY_URL,
  VA_TREATMENT_DATE_PROMPT_URL,
  VA_TREATMENT_DATE_URL,
} from '../../constants';
import { content as summaryContent } from '../../content/evidence/summary';
import { locationContent, promptTitle } from '../../content/evidence/va';
import VaPrompt from '../../components/evidence/VaPrompt';
import { focusRadioH3 } from '../../../../shared/utils/focus';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'vaEvidence',
  nounSingular: 'New and relevant evidence',
  nounPlural: 'New and relevant evidence',
  required: true,
  isItemIncomplete: item =>
    !item?.name || !item?.issues || !item?.treatmentDate,
  maxItems: 100,
  text: {
    getItemName: (item, index, fullData) => item.name,
    cardDescription: item => `${formatReviewDate(item?.date)}`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    [HAS_VA_EVIDENCE]: {
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: [HAS_VA_EVIDENCE],
    properties: {
      [HAS_VA_EVIDENCE]: {
        type: 'boolean',
      },
      'view:vaEvidenceInfo': {
        type: 'object',
        properties: {},
      },
    },
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
    [HAS_VA_EVIDENCE]: arrayBuilderYesNoUI(options),
  },
  schema: {
    type: 'object',
    properties: {
      [HAS_VA_EVIDENCE]: arrayBuilderYesNoSchema,
    },
    required: [HAS_VA_EVIDENCE],
  },
};

/** @returns {PageSchema} */
const locationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: locationContent.question,
      nounSingular: options.nounSingular,
    }),
    name: textUI({
      title: locationContent.label,
      errorMessages: {
        required: locationContent.requiredError,
        maxLength: locationContent.maxLengthError,
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
    },
    required: ['name'],
  },
};

/** @returns {PageSchema} */
const datePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => (formData?.name ? `Date at ${formData.name}` : 'Date'),
    ),
    date: currentOrPastDateUI(),
  },
  schema: {
    type: 'object',
    properties: {
      date: currentOrPastDateSchema,
    },
    required: ['date'],
  },
};

export default arrayBuilderPages(options, pageBuilder => ({
  vaPrompt: pageBuilder.introPage({
    title: promptTitle,
    // path: VA_PROMPT_URL,
    path: 'TESTING',
    CustomPage: VaPrompt,
    CustomPageReview: null,
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
    scrollAndFocusTarget: focusRadioH3,
  }),
  vaSummary: pageBuilder.summaryPage({
    title: 'Review your [noun plural]',
    path: VA_SUMMARY_URL,
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  vaLocation: pageBuilder.itemPage({
    title: 'Location title',
    path: VA_LOCATION_URL,
    uiSchema: locationPage.uiSchema,
    schema: locationPage.schema,
  }),
  // conditions: pageBuilder.itemPage({
  //   title: 'Conditions',
  //   path: VA_CONDITIONS_URL,
  //   uiSchema: datePage.uiSchema,
  //   schema: datePage.schema,
  // }),
  // treatmentDatePrompt: pageBuilder.itemPage({
  //   title: 'Treatment date prompt',
  //   path: VA_TREATMENT_DATE_PROMPT_URL,
  //   uiSchema: datePage.uiSchema,
  //   schema: datePage.schema,
  // }),
  // treatmentDate: pageBuilder.itemPage({
  //   title: 'Treatment date',
  //   path: VA_TREATMENT_DATE_URL,
  //   uiSchema: datePage.uiSchema,
  //   schema: datePage.schema,
  // }),
}));
