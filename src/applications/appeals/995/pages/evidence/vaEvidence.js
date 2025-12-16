import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  checkboxGroupSchema,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
  radioUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { getAddOrEditMode, getSelectedIssues } from '../../utils/evidence';
import {
  dateDetailsContent,
  datePromptContent,
  locationContent,
  promptContent,
  summaryContent,
} from '../../content/evidence/va';
import { issuesContent } from './common';
import { getSelected } from '../../../shared/utils/issues';
import {
  EVIDENCE_URLS,
  VA_EVIDENCE_KEY,
  VA_EVIDENCE_PROMPT_KEY,
  VA_TREATMENT_BEFORE_2005_KEY,
  VA_TREATMENT_LOCATION_KEY,
  VA_TREATMENT_MONTH_YEAR_KEY,
} from '../../constants';
import { redesignActive } from '../../utils';
import { hasTreatmentBefore2005 } from '../../utils/form-data-retrieval';

/**
 * This is how we determine whether all of the info for one
 * evidence record is complete. This is what the summary page
 * uses to display an error or not
 * @param {object} item
 * @returns bool
 */
const itemIsComplete = item => {
  let treatmentDateRequirement = item[VA_TREATMENT_BEFORE_2005_KEY];
  const issuesComplete = getSelectedIssues(item)?.length > 0;

  if (item[VA_TREATMENT_BEFORE_2005_KEY] === 'Y') {
    treatmentDateRequirement =
      item[VA_TREATMENT_BEFORE_2005_KEY] && item[VA_TREATMENT_MONTH_YEAR_KEY];
  }

  return (
    issuesComplete &&
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
  arrayPath: VA_EVIDENCE_KEY,
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
        useFormsPattern: true,
        formHeading: promptContent.question,
        formDescription: promptContent.description,
        title: null,
        labels: promptContent.options,
        formHeadingLevel: '3',
        labelHeaderLevel: null,
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

// Create base UI with minimal config - labels will be dynamically added
const baseIssuesCheckboxUI = {
  'ui:title': issuesContent.label,
  'ui:webComponentField': VaCheckboxGroupField,
  'ui:errorMessages': {
    atLeastOne: issuesContent.requiredError,
  },
  'ui:required': () => true,
  'ui:validations': [validateBooleanGroup],
};

const issuesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) =>
      issuesContent.question('va', formData, getAddOrEditMode()),
    ),
    issuesVA: {
      ...baseIssuesCheckboxUI,
      'ui:options': {
        updateSchema: (...args) => {
          // eslint-disable-next-line no-unused-vars
          const [_itemData, schema, _uiSchema, index, _path, fullData] = args;

          const selectedIssues = getSelected(fullData).map(issue => {
            if (issue?.attributes) {
              return issue?.attributes?.ratingIssueSubjectText;
            }
            return issue.issue;
          });

          const properties = {};
          const issueUiSchemas = {};

          selectedIssues.forEach(issue => {
            properties[issue] = {
              type: 'boolean',
              title: issue,
            };
            issueUiSchemas[issue] = {
              'ui:title': issue,
            };
          });

          return {
            type: 'object',
            properties,
            issueUiSchemas,
          };
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['issuesVA'],
    properties: {
      issuesVA: checkboxGroupSchema(['na']),
    },
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
    depends: formData => redesignActive(formData),
  }),
  vaLocation: pageBuilder.itemPage({
    title: '',
    path: EVIDENCE_URLS.vaLocation,
    uiSchema: locationPage.uiSchema,
    schema: locationPage.schema,
    depends: formData => redesignActive(formData),
  }),
  issuesVA: pageBuilder.itemPage({
    title: '',
    path: EVIDENCE_URLS.vaIssues,
    uiSchema: issuesPage.uiSchema,
    schema: issuesPage.schema,
    depends: formData => redesignActive(formData),
  }),
  treatmentDatePrompt: pageBuilder.itemPage({
    title: 'Treatment date prompt',
    path: EVIDENCE_URLS.vaTreatmentDatePrompt,
    uiSchema: datePromptPage.uiSchema,
    schema: datePromptPage.schema,
    depends: formData => redesignActive(formData),
  }),
  treatmentDateVA: pageBuilder.itemPage({
    title: 'Treatment date',
    path: EVIDENCE_URLS.vaTreatmentDateDetails,
    uiSchema: dateDetailsPage.uiSchema,
    schema: dateDetailsPage.schema,
    depends: (formData, index) =>
      redesignActive(formData) && hasTreatmentBefore2005(formData, index),
  }),
}));
