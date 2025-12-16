import React from 'react';
import {
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  checkboxGroupSchema,
  currentOrPastDateDigitsSchema,
  currentOrPastDateDigitsUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { getAddOrEditMode, getSelectedIssues } from '../../utils/evidence';
import Authorization from '../../components/4142/Authorization';
import { issuesContent } from './common';
import { getSelected } from '../../../shared/utils/issues';
import {
  EVIDENCE_URLS,
  PRIVATE_EVIDENCE_KEY,
  PRIVATE_EVIDENCE_PROMPT_KEY,
} from '../../constants';
import {
  detailsEntryContent,
  promptContent,
  summaryContent,
  treatmentDateContent,
} from '../../content/evidence/private';
import { redesignActive } from '../../utils';

/**
 * This is how we determine whether all of the info for one
 * evidence record is complete. This is what the summary page
 * uses to display an error or not
 * @param {object} item
 * @returns bool
 */
const itemIsComplete = item => {
  const { address, from, to, treatmentLocation } = item;
  const { city, country, postalCode, state, street } = address;
  const issuesComplete = getSelectedIssues(item)?.length > 0;
  const addressIsComplete =
    address && city && country && postalCode && state && street;
  const treatmentDatesComplete = from && to;

  return (
    addressIsComplete &&
    issuesComplete &&
    treatmentDatesComplete &&
    treatmentLocation
  );
};

/**
 * This is the config object for the VA evidence list & loop
 * Here, we can also configure the content on the summary page
 * including the layout of the evidence cards for review
 */
/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: PRIVATE_EVIDENCE_KEY,
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
    [PRIVATE_EVIDENCE_PROMPT_KEY]: arrayBuilderYesNoUI(
      options,
      {
        useFormsPattern: true,
        formHeading: promptContent.question,
        formDescription: promptContent.description,
        title: null,
        labels: promptContent.labels,
        descriptions: promptContent.descriptions,
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
      [PRIVATE_EVIDENCE_PROMPT_KEY]: arrayBuilderYesNoSchema,
    },
    required: [PRIVATE_EVIDENCE_PROMPT_KEY],
  },
};

// This is the original schema that will be dynamically overruled as soon
// as the user lands on this page. We need this for array builder, but since
// we're using a custom component, it will be overwritten anyway
/** @returns {PageSchema} */
const privateAuthorizationPage = {
  uiSchema: {
    authorization: {},
  },
  schema: {
    type: 'object',
    required: ['authorization'],
    properties: {
      authorization: {
        type: 'boolean',
      },
    },
  },
};

/** @returns {PageSchema} */
const locationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: ({ formContext }) =>
        detailsEntryContent.question(formContext, getAddOrEditMode()),
      label: detailsEntryContent.label,
      nounSingular: options.nounSingular,
    }),
    'ui:description': () => (
      <p className="vads-u-font-size--base vads-u-line-height--3 vads-u-margin-top--2 vads-u-margin-bottom--1">
        {detailsEntryContent.label}
      </p>
    ),
    treatmentLocation: textUI({
      title: detailsEntryContent.locationLabel,
      errorMessages: {
        required: detailsEntryContent.locationRequiredError,
      },
      required: () => true,
    }),
    address: addressNoMilitaryUI({
      omit: ['street3'],
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      treatmentLocation: textSchema,
      address: addressNoMilitarySchema({
        omit: ['street3'],
      }),
    },
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
      issuesContent.question('private', formData, getAddOrEditMode()),
    ),
    issuesPrivate: {
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
    required: ['issuesPrivate'],
    properties: {
      issuesPrivate: checkboxGroupSchema(['na']),
    },
  },
};

/** @returns {PageSchema} */
const treatmentDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) =>
      treatmentDateContent.question(formData, getAddOrEditMode()),
    ),
    from: currentOrPastDateDigitsUI({
      title: treatmentDateContent.firstDateLabel,
      hint: treatmentDateContent.dateHint,
      errorMessages: {
        required: treatmentDateContent.requiredError,
      },
      removeDateHint: true,
    }),
    to: currentOrPastDateDigitsUI({
      title: treatmentDateContent.lastDateLabel,
      hint: treatmentDateContent.dateHint,
      errorMessages: {
        required: treatmentDateContent.requiredError,
      },
      removeDateHint: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      from: currentOrPastDateDigitsSchema,
      to: currentOrPastDateDigitsSchema,
    },
    required: ['to', 'from'],
  },
};

/**
 * This is where the array builder gets page configuration.
 * Some items have blank titles because a title is required for the
 * pageBuilder config but the uiSchemas they use also require titles
 * which override the ones here
 */
export default arrayBuilderPages(options, pageBuilder => ({
  privateSummary: pageBuilder.summaryPage({
    title: '',
    path: EVIDENCE_URLS.privateSummary,
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
    depends: formData => redesignActive(formData),
  }),
  authorization: pageBuilder.itemPage({
    title: '',
    path: EVIDENCE_URLS.privateAuthorization,
    uiSchema: privateAuthorizationPage.uiSchema,
    schema: privateAuthorizationPage.schema,
    CustomPage: props =>
      Authorization({
        ...props,
        // resolve prop warning that the index is a string rather than a number
        pagePerItemIndex: +props.pagePerItemIndex,
      }),
    depends: (props, index) => {
      return redesignActive(props) && index === 0;
    },
  }),
  privateLocation: pageBuilder.itemPage({
    title: '',
    path: EVIDENCE_URLS.privateDetails,
    uiSchema: locationPage.uiSchema,
    schema: locationPage.schema,
    depends: formData => redesignActive(formData),
  }),
  issuesPrivate: pageBuilder.itemPage({
    title: '',
    path: EVIDENCE_URLS.privateIssues,
    uiSchema: issuesPage.uiSchema,
    schema: issuesPage.schema,
    depends: formData => redesignActive(formData),
  }),
  treatmentDatePrivate: pageBuilder.itemPage({
    title: 'Treatment date',
    path: EVIDENCE_URLS.privateTreatmentDate,
    uiSchema: treatmentDatePage.uiSchema,
    schema: treatmentDatePage.schema,
    depends: formData => redesignActive(formData),
  }),
}));
