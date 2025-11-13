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
console.log('loading the array builder');

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    [HAS_VA_EVIDENCE]: arrayBuilderYesNoUI({
      ...options,
      labelHeaderLevel: '3',
      labels: {
        y:
          'Yes, get my VA medical records or military health records to support my claim',
        n:
          "No, I don't need my VA medical records or military health records to support my claim",
      },
      description: (
        <>
          <p>TEST</p>
          <p>
            We can collect your VA medical records or military health records
            from any of these sources to support your claim:
          </p>
          <ul>
            <li>VA medical center</li>
            <li>Community-based outpatient clinic</li>
            <li>Department of Defense military treatment facility</li>
            <li>Community care provider paid for by VA</li>
          </ul>
          <p>We’ll ask you the names of the treatment locations to include.</p>
          <p>
            <strong>Note:</strong> Later in this form, we’ll ask about your
            private (non-VA) provider medical records.
          </p>
        </>
      ),
      required: () => true,
      errorMessages: {
        required: 'Select if we should get your VA medical records',
      },
      hideOnReview: true,
    }),
  },
  schema: {
    type: 'object',
    required: [HAS_VA_EVIDENCE],
    properties: {
      [HAS_VA_EVIDENCE]: arrayBuilderYesNoSchema,
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
    path: EVIDENCE_URLS.vaPrompt,
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
    scrollAndFocusTarget: focusRadioH3,
    // ------- REMOVE when new design toggle is removed
    depends: redesignActive,
    // ------- END REMOVE
  }),
  vaSummary: pageBuilder.summaryPage({
    title: 'Review your [noun plural]',
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
    depends: redesignActive,
    // ------- END REMOVE
  }),
  conditions: pageBuilder.itemPage({
    title: 'Conditions',
    path: EVIDENCE_URLS.vaIssues,
    uiSchema: datePage.uiSchema,
    schema: datePage.schema,
    // ------- REMOVE when new design toggle is removed
    depends: redesignActive,
    // ------- END REMOVE
  }),
  treatmentDatePrompt: pageBuilder.itemPage({
    title: 'Treatment date prompt',
    path: EVIDENCE_URLS.vaTreatmentDatePrompt,
    uiSchema: datePage.uiSchema,
    schema: datePage.schema,
    // ------- REMOVE when new design toggle is removed
    depends: redesignActive,
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
