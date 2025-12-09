import React from 'react';
import {
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateDigitsUI,
  // currentOrPastDateRangeUI,
  // currentOrPastDateRangeSchema,
  textUI,
  textSchema,
  currentOrPastDateDigitsSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { getAddOrEditMode } from '../../utils/evidence';
import Authorization from '../../components/4142/Authorization';
import Issues, { issuesPage } from '../../components/evidence/IssuesNew';
import {
  EVIDENCE_URLS,
  PRIVATE_LOCATION_TREATMENT_DATES_KEY,
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
import {
  hasTreatmentBefore2005,
  hasPrivateEvidenceRecords,
} from '../../utils/form-data-retrieval';

/**
 * This is how we determine whether all of the info for one
 * evidence record is complete. This is what the summary page
 * uses to display an error or not
 * @param {object} item
 * @returns bool
 */
const itemIsComplete = item => {
  const { address, issues, treatmentLocation } = item;
  const issuesComplete = issues?.length;
  const { city, country, postalCode, state, street } = address;
  const addressIsComplete =
    address && city && country && postalCode && state && street;

  return addressIsComplete && issuesComplete && treatmentLocation;
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
    [PRIVATE_EVIDENCE_PROMPT_KEY]: arrayBuilderYesNoUI(
      options,
      {
        title: null,
        labels: promptContent.labels,
        descriptions: promptContent.descriptions,
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
const detailsPage = {
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

// We cannot use our custom hint text here until DST fixes this defect:
// https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/5263
// Array Builder does not support the `removeDateHint` prop used by custom components
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
    // [PRIVATE_LOCATION_TREATMENT_DATES_KEY]: currentOrPastDateRangeUI(
    //   {
    //     title: treatmentDateContent.firstDateLabel,
    //     hint: treatmentDateContent.dateHint,
    //     errorMessages: {
    //       required: treatmentDateContent.requiredError,
    //     },
    //     removeDateHint: true,
    //   },
    //   {
    //     title: treatmentDateContent.lastDateLabel,
    //     hint: treatmentDateContent.dateHint,
    //     errorMessages: {
    //       required: treatmentDateContent.requiredError,
    //     },
    //     removeDateHint: true,
    //   },
    // ),
  },
  schema: {
    type: 'object',
    properties: {
      from: currentOrPastDateDigitsSchema,
      to: currentOrPastDateDigitsSchema,
      //
      // [PRIVATE_LOCATION_TREATMENT_DATES_KEY]: currentOrPastDateRangeSchema,
    },
    required: [PRIVATE_LOCATION_TREATMENT_DATES_KEY],
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
    // ------- REMOVE toggle check when new design toggle is removed
    depends: redesignActive,
    // ------- END REMOVE
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
    // ------- REMOVE toggle check when new design toggle is removed
    depends: (props, index) => {
      return redesignActive && index === 0;
    },
    // ------- END REMOVE
  }),
  privateDetails: pageBuilder.itemPage({
    title: '',
    path: EVIDENCE_URLS.privateDetails,
    uiSchema: detailsPage.uiSchema,
    schema: detailsPage.schema,
    // ------- REMOVE toggle check when new design toggle is removed
    depends: redesignActive,
    // ------- END REMOVE
  }),
  issues: pageBuilder.itemPage({
    title: '',
    path: EVIDENCE_URLS.privateIssues,
    uiSchema: issuesPage.uiSchema,
    schema: issuesPage.schema,
    // Issues requires a custom page because array builder does not
    // natively support checkboxes with dynamic labels
    CustomPage: props =>
      Issues({
        ...props,
        // resolve prop warning that the index is a string rather than a number
        pagePerItemIndex: +props.pagePerItemIndex,
        formKey: PRIVATE_EVIDENCE_KEY,
      }),
    // ------- REMOVE toggle check when new design toggle is removed
    depends: redesignActive,
    // ------- END REMOVE
  }),
  treatmentDate: pageBuilder.itemPage({
    title: 'Treatment date',
    path: EVIDENCE_URLS.privateTreatmentDate,
    uiSchema: treatmentDatePage.uiSchema,
    schema: treatmentDatePage.schema,
    // ------- REMOVE toggle check when new design toggle is removed
    depends: formData => redesignActive(formData),
    // ------- END REMOVE
  }),
}));
