import React from 'react';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  checkboxGroupUI,
  checkboxGroupSchema,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import { EVIDENCE_URLS, HAS_VA_EVIDENCE } from '../../constants';
import {
  issuesContent,
  locationContent,
  promptContent,
  summaryContent,
} from '../../content/evidence/va';
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
    summaryTitle: 'Summary title',
    summaryTitleWithoutItems: promptContent.title,
    summaryDescriptionWithoutItems: (
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
  },
};

/** @returns {PageSchema} */
const summaryPage = {
  uiSchema: {
    [HAS_VA_EVIDENCE]: arrayBuilderYesNoUI(
      options,
      {
        title: '',
        labels: promptContent.options,
        labelHeaderLevel: '3',
        hint: () => null,
      },
      {
        title: summaryContent.title,
        labels: summaryContent.options,
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

const getSelectedIssues = formData => {
  const selectedIssues = formData?.contestedIssues?.filter(
    issue => issue?.['view:selected'],
  );

  return (
    selectedIssues?.map(
      selectedIssue => selectedIssue?.attributes?.ratingIssueSubjectText,
    ) || []
  );
};

/** @returns {PageSchema} */
const issuesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.name ? `Issues at ${formData.name}` : 'Issues',
    ),
    issues: {
      ...checkboxGroupUI({
        title: issuesContent.title,
        hint: issuesContent.hint,
        required: true,
        labels: {}, // Initial empty labels
      }),
      'ui:options': {
        ...checkboxGroupUI({
          title: issuesContent.title,
          hint: issuesContent.hint,
          required: true,
          labels: {},
        })['ui:options'],
        updateSchema: (formData, schema, uiSchema) => {
          const selectedIssues = getSelectedIssues(formData);

          if (!selectedIssues?.length) {
            // Return original if no issues
            return { schema, uiSchema };
          }

          const formattedIssuesForCheckboxes = {};
          for (const issue of selectedIssues) {
            const key = issue.toUpperCase().replace(/\s+/g, '_'); // Convert to valid key
            formattedIssuesForCheckboxes[key] = issue;
          }

          // Update schema with dynamic enum values
          const newSchema = {
            ...schema,
            properties: {
              ...schema.properties,
              issues: checkboxGroupSchema(
                Object.keys(formattedIssuesForCheckboxes),
              ),
            },
          };

          // Update uiSchema with dynamic labels
          const newUiSchema = {
            ...uiSchema,
            issues: {
              ...uiSchema.issues,
              'ui:options': {
                ...uiSchema.issues['ui:options'],
                labels: formattedIssuesForCheckboxes,
              },
            },
          };

          return { schema: newSchema, uiSchema: newUiSchema };
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      issues: checkboxGroupSchema([]), // Start with empty array
    },
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

// Some items in here have blank titles because a title is required
// but the uiSchemas they use also require titles
// which override the ones here
export default arrayBuilderPages(options, pageBuilder => ({
  vaSummary: pageBuilder.summaryPage({
    title: '',
    // title: promptContent.title,
    path: EVIDENCE_URLS.vaSummary,
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
    // ------- REMOVE when new design toggle is removed
    depends: redesignActive,
    // ------- END REMOVE
  }),
  vaLocation: pageBuilder.itemPage({
    title: '',
    path: EVIDENCE_URLS.vaLocation,
    uiSchema: locationPage.uiSchema,
    schema: locationPage.schema,
    // ------- REMOVE when new design toggle is removed
    depends: redesignActive,
    // ------- END REMOVE
  }),
  issues: pageBuilder.itemPage({
    title: '',
    path: EVIDENCE_URLS.vaIssues,
    uiSchema: issuesPage.uiSchema,
    schema: issuesPage.schema,
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
