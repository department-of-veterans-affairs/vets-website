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
  nounSingular: 'record',
  nounPlural: 'records',
  required: false,
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
  uiSchema: {},
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

// /** @returns {PageSchema} */
// const summaryPage = {
//   uiSchema: {
//     'view:hasVaEvidenceWidget': arrayBuilderYesNoUI(
//       options,
//       {
//         title: promptTitle,
//         scrollAndFocusTarget: focusRadioH3,
//         depends: redesignActive,
//       },
//       {
//         title: 'Do you want us to request records from another VA provider?',
//         labelHeaderLevel: '3',
//         labels: {
//           Y: 'Yes',
//           N: 'No',
//         },
//       },
//     ),
//   },
//   schema: {
//     type: 'object',
//     properties: {
//       'view:hasVaEvidenceWidget': arrayBuilderYesNoSchema,
//     },
//   },
// };

/** @returns {PageSchema} */
const locationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: ({ formContext }) => {
        const index = formContext?.pagePerItemIndex || 0;
        return locationContent.question('add', Number(index) + 1);
      },
      nounSingular: options.nounSingular,
    }),
    name: textUI({
      title: locationContent.label,
      hint: locationContent.hint,
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

// const VaSummaryDescription = ({ data }) => {
//   // Only show description on first-time view (no items yet)
//   const hasItems = data?.vaEvidence && data.vaEvidence.length > 0;

//   if (hasItems) {
//     return null; // Don't show description when items exist
//   }

//   return (
//     <>
//       <p>
//         We can collect your VA medical records or military health records from
//         any of these sources to support your claim:
//       </p>
//       <ul>
//         <li>VA medical center</li>
//         <li>Community-based outpatient clinic</li>
//         <li>Department of Defense military treatment facility</li>
//         <li>Community care provider paid for by VA</li>
//       </ul>
//       <p>We’ll ask you the names of the treatment locations to include.</p>
//     </>
//   );
// };

/** @returns {PageSchema} */
const summaryPage = {
  uiSchema: {
    'ui:description': (
      <>
        <p>
          We can collect your VA medical records or military health records from
          any of these sources to support your claim:
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
    [HAS_VA_EVIDENCE]: arrayBuilderYesNoUI(
      options,
      {
        title:
          'Do you want us to get your VA medical records or military health records?',
        labels: {
          Y:
            'Yes, get my VA medical records or military health records to support my claim',
          N:
            "No, I don't need my VA medical records or military health records to support my claim",
        },
        labelHeaderLevel: '3',
      },
      {
        title: 'Do you want us to request records from another VA provider?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
        labelHeaderLevel: '3',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      [HAS_VA_EVIDENCE]: arrayBuilderYesNoSchema,
    },
    required: [HAS_VA_EVIDENCE],
  },
};

export default arrayBuilderPages(options, pageBuilder => ({
  // vaPrompt: pageBuilder.introPage({
  //   title: promptTitle,
  //   path: EVIDENCE_URLS.vaPrompt,
  //   CustomPage: VaPrompt,
  //   CustomPageReview: null,
  //   uiSchema: introPage.uiSchema,
  //   schema: introPage.schema,
  //   scrollAndFocusTarget: focusRadioH3,
  //   depends: redesignActive,
  // }),
  // vaSummary: pageBuilder.summaryPage({
  //   title: promptTitle,
  //   CustomPage: VaPrompt,
  //   path: EVIDENCE_URLS.vaSummary,
  //   uiSchema: summaryPage.uiSchema,
  //   schema: summaryPage.schema,
  //   // ------- REMOVE when new design toggle is removed
  //   depends: redesignActive,
  //   // ------- END REMOVE
  // }),
  vaSummary: pageBuilder.summaryPage({
    title: 'Request VA medical records',
    path: EVIDENCE_URLS.vaSummary,
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
    // summaryDescription: VaSummaryDescription,
    depends: redesignActive,
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
