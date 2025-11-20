import React from 'react';
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
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import Issues, { issuesPage } from '../../components/evidence/IssuesNew';
import {
  EVIDENCE_URLS,
  VA_TREATMENT_BEFORE_2005_KEY,
  VA_TREATMENT_MONTH_YEAR_KEY,
} from '../../constants';
import {
  dateDetailsContent,
  datePromptContent,
  issuesContent,
  locationContent,
  promptContent,
  summaryContent,
} from '../../content/evidence/va';
import { focusRadioH3 } from '../../../shared/utils/focus';
import { redesignActive } from '../../utils';
import { hasTreatmentBefore2005 } from '../../utils/form-data-retrieval';

const itemIsComplete = item => {
  const { issues, name, treatmentBefore2005, treatmentMonthYear } = item;

  let treatmentDateRequirement = treatmentBefore2005;
  const issuesRequirement = issues?.length;

  if (treatmentBefore2005 === 'Y') {
    treatmentDateRequirement = treatmentBefore2005 && treatmentMonthYear;
  }

  return issuesRequirement && name && treatmentDateRequirement;
};

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'vaEvidence',
  nounSingular: 'record',
  nounPlural: 'records',
  required: false,
  isItemIncomplete: item => !itemIsComplete(item),
  maxItems: 100,
  text: {
    getItemName: item => item.name,
    cardDescription: item => `${formatReviewDate(item?.date)}`,
    summaryTitle: 'Summary title',
    summaryTitleWithoutItems: promptContent.question,
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
    hasVaEvidence: arrayBuilderYesNoUI(
      options,
      {
        title: '',
        labels: promptContent.options,
        labelHeaderLevel: '3',
        hint: () => null,
        errorMessages: {
          required: promptContent.requiredError,
        },
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
      hasVaEvidence: arrayBuilderYesNoSchema,
    },
    required: ['hasVaEvidence'],
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

/** @returns {PageSchema} */
const datePromptPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.name
          ? `Did treatment for your TODO at ${formData.name} start before 2005?`
          : 'Did treatment for your TODO start before 2005?',
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
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.name
          ? `When did treatment for your TODO at ${formData.name} start?`
          : 'When did treatment for your TODO start?',
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

// Some items have blank titles because a title is required for the
// pageBuilder config but the uiSchemas they use also require titles
// which override the ones here
export default arrayBuilderPages(options, pageBuilder => ({
  vaSummary: pageBuilder.summaryPage({
    title: '',
    path: EVIDENCE_URLS.vaSummary,
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
    depends: redesignActive,
  }),
  vaLocation: pageBuilder.itemPage({
    title: '',
    path: EVIDENCE_URLS.vaLocation,
    uiSchema: locationPage.uiSchema,
    schema: locationPage.schema,
    depends: redesignActive,
  }),
  issues: pageBuilder.itemPage({
    title: '',
    path: EVIDENCE_URLS.vaIssues,
    uiSchema: issuesPage.uiSchema,
    schema: issuesPage.schema,
    // Issues requires a custom page because array builder does not
    // natively support checkboxes with labels from formData
    // rather than hardcoded checkboxes
    CustomPage: props =>
      Issues({
        ...props,
        // resolve prop warning that the index is a string rather than a number
        pagePerItemIndex: +props.pagePerItemIndex,
      }),
    depends: redesignActive,
  }),
  treatmentDatePrompt: pageBuilder.itemPage({
    title: 'Treatment date prompt',
    path: EVIDENCE_URLS.vaTreatmentDatePrompt,
    uiSchema: datePromptPage.uiSchema,
    schema: datePromptPage.schema,
    depends: redesignActive,
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
        redesignActive(formData) &&
        hasTreatmentBefore2005(formData, currentIndex)
      );
    },
  }),
}));
