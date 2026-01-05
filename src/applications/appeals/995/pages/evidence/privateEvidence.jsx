import React from 'react';
import {
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateDigitsSchema,
  currentOrPastDateDigitsUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { getAddOrEditMode, getSelectedIssues } from '../../utils/evidence';
import Authorization from '../../components/4142/AuthorizationNew';
import {
  EVIDENCE_URLS,
  PRIVATE_EVIDENCE_KEY,
  PRIVATE_EVIDENCE_PROMPT_KEY,
  PRIVATE_TREATMENT_LOCATION_KEY,
} from '../../constants';
import {
  detailsEntryContent,
  promptContent,
  summaryContent,
  treatmentDateContent,
} from '../../content/evidence/private';
import { redesignActive } from '../../utils';
import { issuesPage } from './common';

/**
 * This is how we determine whether all of the info for one
 * evidence record is complete. This is what the summary page
 * uses to display an error or not
 * @param {object} item
 * @returns bool
 */
const itemIsComplete = item => {
  const {
    address,
    privateTreatmentLocation,
    treatmentStart,
    treatmentEnd,
  } = item;
  const { city, country, postalCode, state, street } = address;
  const issuesComplete = getSelectedIssues(item)?.length > 0;
  const addressIsComplete =
    address && city && country && postalCode && state && street;
  const treatmentDatesComplete = treatmentStart && treatmentEnd;

  return (
    addressIsComplete &&
    issuesComplete &&
    treatmentDatesComplete &&
    privateTreatmentLocation
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
    getItemName: item => item?.[PRIVATE_TREATMENT_LOCATION_KEY],
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
        errorMessages: {
          required: summaryContent.requiredError,
        },
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
    privateTreatmentLocation: textUI({
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
      privateTreatmentLocation: textSchema,
      address: addressNoMilitarySchema({
        omit: ['street3'],
      }),
    },
  },
};

/** @returns {PageSchema} */
const treatmentDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) =>
      treatmentDateContent.question(formData, getAddOrEditMode()),
    ),
    treatmentStart: currentOrPastDateDigitsUI({
      title: treatmentDateContent.firstDateLabel,
      hint: treatmentDateContent.dateHint,
      errorMessages: {
        required: treatmentDateContent.requiredError,
      },
      removeDateHint: true,
    }),
    treatmentEnd: currentOrPastDateDigitsUI({
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
      treatmentStart: currentOrPastDateDigitsSchema,
      treatmentEnd: currentOrPastDateDigitsSchema,
    },
    required: ['treatmentEnd', 'treatmentStart'],
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
        addOrEditMode: getAddOrEditMode(),
        // resolve prop warning that the index is a string rather than a number
        pagePerItemIndex: +props.pagePerItemIndex,
      }),
    depends: (formData, index) => {
      return redesignActive(formData) && index === 0;
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
    uiSchema: issuesPage('private', 'issuesPrivate').uiSchema,
    schema: issuesPage('private', 'issuesPrivate').schema,
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
