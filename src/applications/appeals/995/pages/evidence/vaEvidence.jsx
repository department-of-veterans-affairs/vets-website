import React from 'react';
import { format } from 'date-fns';
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
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { parseStringOrDate } from 'platform/utilities/date';
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
  issuesContent,
  locationContent,
  promptContent,
  summaryContent,
} from '../../content/evidence/va';
import { focusRadioH3 } from '../../../shared/utils/focus';
import { redesignActive } from '../../utils';
import { hasTreatmentBefore2005 } from '../../utils/form-data-retrieval';
import { formatIssueList } from '../../../shared/utils/contestableIssueMessages';

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

const formatMonthYear = date => {
  const parsedDate = parseStringOrDate(date);
  return format(parsedDate, 'MMMM yyyy');
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
    alertItemUpdated: ({ itemData }) =>
      `${itemData[VA_TREATMENT_LOCATION_KEY]} information has been updated.`,
    cardDescription: item => {
      return (
        <>
          {item?.[VA_TREATMENT_LOCATION_KEY] && (
            <h3 className="vads-u-margin-top--0">
              {item[VA_TREATMENT_LOCATION_KEY]}
            </h3>
          )}
          {item?.issues?.length === 1 && (
            <p>
              <strong>Condition:</strong> {item.issues[0]}
            </p>
          )}
          {item?.issues?.length > 1 && (
            <p>
              <strong>Conditions:</strong> {formatIssueList(item.issues)}
            </p>
          )}
          {item?.[VA_TREATMENT_MONTH_YEAR_KEY] && (
            <p>
              <strong>Treatment start date:</strong>
              &nbsp;
              {formatMonthYear(item[VA_TREATMENT_MONTH_YEAR_KEY])}
            </p>
          )}
        </>
      );
    },
    summaryTitle: summaryContent.titleWithItems,
    summaryTitleWithoutItems: promptContent.question,
    summaryDescription: (
      <p className="vads-u-font-family--serif vads-u-font-weight--bold">
        {summaryContent.descriptionWithItems}
      </p>
    ),
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
      title: ({ formContext }) => {
        const index = formContext?.pagePerItemIndex || 0;
        return locationContent.question('add', Number(index) + 1);
      },
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
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.[VA_TREATMENT_LOCATION_KEY]
          ? `Did treatment at ${
              formData[VA_TREATMENT_LOCATION_KEY]
            } start before 2005?`
          : 'Did treatment start before 2005?',
    ),
    [VA_TREATMENT_BEFORE_2005_KEY]: radioUI({
      title: `If treatment for your service-connected condition(s) started before 2005, we’ll ask for approximate dates to help us find the paper records.`,
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
        formData?.[VA_TREATMENT_LOCATION_KEY]
          ? `When did treatment at ${
              formData[VA_TREATMENT_LOCATION_KEY]
            } start?`
          : 'When did treatment start?',
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
