import React from 'react';
import { getArrayUrlSearchParams } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
  radioUI,
  textUI,
  textSchema,
  withEditTitle,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { getAddOrEditMode } from '../../utils/evidence';
import Issues, { issuesPage } from '../../components/evidence/IssuesNew';
import {
  EVIDENCE_URLS,
  VA_EVIDENCE_PROMPT_KEY,
  VA_TREATMENT_BEFORE_2005_KEY,
  VA_TREATMENT_LOCATION_KEY,
  VA_TREATMENT_MONTH_YEAR_KEY,
} from '../../constants';
import {
  dateDetailsContent,
  datePromptContent,
  locationContent,
  promptContent,
  summaryContent,
} from '../../content/evidence/va';
import { redesignActive } from '../../utils';
import {
  hasTreatmentBefore2005,
  hasVAEvidenceRecords,
} from '../../utils/form-data-retrieval';

/**
 * This is how we determine whether all of the info for one
 * evidence record is complete. This is what the summary page
 * uses to display an error or not
 * @param {object} item
 * @returns bool
 */
const itemIsComplete = item => {
  let treatmentDateRequirement = item[VA_TREATMENT_BEFORE_2005_KEY];
  const issuesRequirement = item.issues?.length;

  if (item[VA_TREATMENT_BEFORE_2005_KEY] === 'Y') {
    treatmentDateRequirement =
      item[VA_TREATMENT_BEFORE_2005_KEY] && item[VA_TREATMENT_MONTH_YEAR_KEY];
  }

  return (
    issuesRequirement &&
    item[VA_TREATMENT_LOCATION_KEY] &&
    treatmentDateRequirement
  );
};

/**
 * This is the config object for the VA evidence list & loop
 * Here, we can also configure the content on the summary page
 * including the layout of the evidence cards for review
 */
/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'vaEvidence',
  nounSingular: 'record',
  nounPlural: 'records',
  required: false,
  isItemIncomplete: item => !itemIsComplete(item),
  maxItems: 100,
  text: {
    alertItemUpdated: ({ itemData }) =>
      summaryContent.alertItemUpdatedText(itemData),
    cardDescription: item => summaryContent.cardDescription(item),
    summaryDescription: summaryContent.descriptionWithItems,
    summaryTitleWithoutItems: promptContent.question,
    summaryDescriptionWithoutItems: promptContent.description,
    summaryTitle: summaryContent.titleWithItems,
  },
};

/**
 * In the optional list & loop flow, the summary page can be configured
 * with both intro page and summary page options (the 2nd and 3rd param
 * passed to arrayBuilderYesNoUI).
 */
/** @returns {PageSchema} */
const summaryPage = {
  uiSchema: {
    [VA_EVIDENCE_PROMPT_KEY]: arrayBuilderYesNoUI(
      options,
      {
        title: null,
        labels: promptContent.options,
        labelHeaderLevel: '3',
        hint: null,
        errorMessages: {
          required: promptContent.requiredError,
        },
      },
      {
        title: summaryContent.question,
        labels: summaryContent.options,
        labelHeaderLevel: '4',
        hint: null,
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      [VA_EVIDENCE_PROMPT_KEY]: arrayBuilderYesNoSchema,
    },
    required: [VA_EVIDENCE_PROMPT_KEY],
  },
};

/** @returns {PageSchema} */
const locationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: ({ formContext }) =>
        locationContent.question(formContext, getAddOrEditMode()),
      nounSingular: options.nounSingular,
    }),
    [VA_TREATMENT_LOCATION_KEY]: textUI({
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
      [VA_TREATMENT_LOCATION_KEY]: textSchema,
    },
    required: [VA_TREATMENT_LOCATION_KEY],
  },
};

/** @returns {PageSchema} */
const datePromptPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) =>
      datePromptContent.question(formData, getAddOrEditMode()),
    ),
    [VA_TREATMENT_BEFORE_2005_KEY]: radioUI({
      title: datePromptContent.label,
      labels: datePromptContent.options,
      errorMessages: {
        required: datePromptContent.requiredError,
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      [VA_TREATMENT_BEFORE_2005_KEY]: {
        type: 'string',
        enum: ['Y', 'N'],
      },
    },
    required: [VA_TREATMENT_BEFORE_2005_KEY],
  },
};

/** @returns {PageSchema} */
const dateDetailsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) =>
      dateDetailsContent.question(formData, getAddOrEditMode()),
    ),
    [VA_TREATMENT_MONTH_YEAR_KEY]: currentOrPastMonthYearDateUI({
      title: dateDetailsContent.label,
      errorMessages: {
        required: dateDetailsContent.requiredError,
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      [VA_TREATMENT_MONTH_YEAR_KEY]: currentOrPastMonthYearDateSchema,
    },
    required: [VA_TREATMENT_MONTH_YEAR_KEY],
  },
};

/**
 * This is where the array builder gets page configuration.
 * Some items have blank titles because a title is required for the
 * pageBuilder config but the uiSchemas they use also require titles
 * which override the ones here
 */
export default arrayBuilderPages(options, pageBuilder => ({
  vaSummary: pageBuilder.summaryPage({
    title: '',
    path: EVIDENCE_URLS.vaSummary,
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
    // ------- REMOVE toggle check when new design toggle is removed
    depends: redesignActive,
    // ------- END REMOVE
  }),
  vaLocation: pageBuilder.itemPage({
    title: '',
    path: EVIDENCE_URLS.vaLocation,
    uiSchema: locationPage.uiSchema,
    schema: locationPage.schema,
    // ------- REMOVE toggle check when new design toggle is removed
    // depends: redesignActive && hasVAEvidenceRecords,
    depends: redesignActive,
    // ------- END REMOVE
  }),
  issues: pageBuilder.itemPage({
    title: '',
    path: EVIDENCE_URLS.vaIssues,
    uiSchema: issuesPage.uiSchema,
    schema: issuesPage.schema,
    // Issues requires a custom page because array builder does not
    // natively support checkboxes with dynamic labels
    CustomPage: props =>
      Issues({
        ...props,
        // resolve prop warning that the index is a string rather than a number
        pagePerItemIndex: +props.pagePerItemIndex,
        addOrEdit: getAddOrEditMode(),
      }),
    // ------- REMOVE toggle check when new design toggle is removed
    depends: redesignActive,
    // ------- END REMOVE
  }),
  treatmentDatePrompt: pageBuilder.itemPage({
    title: 'Treatment date prompt',
    path: EVIDENCE_URLS.vaTreatmentDatePrompt,
    uiSchema: datePromptPage.uiSchema,
    schema: datePromptPage.schema,
    // ------- REMOVE toggle check when new design toggle is removed
    depends: redesignActive,
    // ------- END REMOVE
  }),
  treatmentDate: pageBuilder.itemPage({
    title: 'Treatment date',
    path: EVIDENCE_URLS.vaTreatmentDateDetails,
    uiSchema: dateDetailsPage.uiSchema,
    schema: dateDetailsPage.schema,
    depends: formData => {
      const evidenceEntriesCount = formData?.vaEvidence?.length || 1;
      const currentIndex = evidenceEntriesCount - 1;
      return (
        // ------- REMOVE toggle check when new design toggle is removed
        redesignActive(formData) &&
        // ------- END REMOVE
        hasTreatmentBefore2005(formData, currentIndex)
      );
    },
  }),
}));
