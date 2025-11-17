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
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import Issues from './issues';
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

/** @returns {PageSchema} */
const issuesPage = {
  uiSchema: {},
  schema: {
    type: 'object',
    required: ['issues'],
    properties: {
      issues: checkboxGroupSchema([]),
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
    CustomPage: props => Issues(props),
    depends: redesignActive,
  }),
  treatmentDatePrompt: pageBuilder.itemPage({
    title: 'Treatment date prompt',
    path: EVIDENCE_URLS.vaTreatmentDatePrompt,
    uiSchema: datePage.uiSchema,
    schema: datePage.schema,
    depends: redesignActive,
  }),
  treatmentDate: pageBuilder.itemPage({
    title: 'Treatment date',
    path: EVIDENCE_URLS.vaTreatmentDateDetails,
    uiSchema: datePage.uiSchema,
    schema: datePage.schema,
    depends: redesignActive,
  }),
}));
