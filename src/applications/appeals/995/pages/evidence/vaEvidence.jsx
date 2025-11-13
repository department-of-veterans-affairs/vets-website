import React from 'react';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import { EVIDENCE_URLS, HAS_VA_EVIDENCE } from '../../constants';
import { content as summaryContent } from '../../content/evidence/summary';
import { locationContent, promptTitle } from '../../content/evidence/va';
import { focusRadioH3 } from '../../../shared/utils/focus';
import { redesignActive } from '../../utils';
import { hasVAEvidence } from '../../utils/form-data-retrieval';
import VaPrompt from '../../components/evidence/VaPrompt';

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
    'ui:description': '', // CustomPage handles rendering
  },
  schema: {
    type: 'object',
    properties: {
      [HAS_VA_EVIDENCE]: {
        type: 'boolean',
      },
    },
    required: [HAS_VA_EVIDENCE],
  },
};

/**
 * This page is skipped on the first loop for required flow
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
/** @returns {PageSchema} */
const summaryPage = {
  uiSchema: {
    'view:hasVaEvidenceWidget': arrayBuilderYesNoUI(options, {
      title: 'Do you want us to request records from another VA provider?',
      labelHeaderLevel: '3',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasVaEvidenceWidget': arrayBuilderYesNoSchema,
    },
  },
};

/** @returns {PageSchema} */
const locationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: ({ formData, pagePerItemIndex }) => {
        console.log('index: ', pagePerItemIndex);
        console.log('current item data: ', formData);
        return 'test';
      },
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
    path: EVIDENCE_URLS.vaPrompt,
    CustomPage: VaPrompt,
    CustomPageReview: null,
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
    scrollAndFocusTarget: focusRadioH3,
    depends: redesignActive,
  }),
  vaSummary: pageBuilder.summaryPage({
    title: promptTitle,
    path: EVIDENCE_URLS.vaSummary,
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
    // ------- REMOVE when new design toggle is removed
    depends: redesignActive,
    // ------- END REMOVE
  }),
  vaLocation: pageBuilder.itemPage({
    title: 'Location title',
    path: EVIDENCE_URLS.vaLocation,
    uiSchema: locationPage.uiSchema,
    schema: locationPage.schema,
    // ------- REMOVE when new design toggle is removed
    depends: redesignActive && hasVAEvidence,
    // ------- END REMOVE
  }),
  conditions: pageBuilder.itemPage({
    title: 'Conditions',
    path: EVIDENCE_URLS.vaIssues,
    uiSchema: datePage.uiSchema,
    schema: datePage.schema,
    // ------- REMOVE when new design toggle is removed
    depends: redesignActive && hasVAEvidence,
    // ------- END REMOVE
  }),
  treatmentDatePrompt: pageBuilder.itemPage({
    title: 'Treatment date prompt',
    path: EVIDENCE_URLS.vaTreatmentDatePrompt,
    uiSchema: datePage.uiSchema,
    schema: datePage.schema,
    // ------- REMOVE when new design toggle is removed
    depends: redesignActive && hasVAEvidence,
    // ------- END REMOVE
  }),
  treatmentDate: pageBuilder.itemPage({
    title: 'Treatment date',
    path: EVIDENCE_URLS.vaTreatmentDateDetails,
    uiSchema: datePage.uiSchema,
    schema: datePage.schema,
    // ------- REMOVE when new design toggle is removed
    depends: redesignActive,
    // ------- END REMOVE
  }),
}));
