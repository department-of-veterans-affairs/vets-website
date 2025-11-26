import React from 'react';

import {
  addressNoMilitaryUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  checkboxUI,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
  radioUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import Authorization from '../../components/4142/Authorization';
import Issues, { issuesPage } from '../../components/evidence/IssuesNew';
import {
  EVIDENCE_URLS,
  PRIVATE_EVIDENCE_PROMPT_KEY,
  PRIVATE_LOCATION_DETAILS_KEY,
} from '../../constants';
import {
  dateDetailsContent,
  datePromptContent,
  detailsContent,
  locationContent,
  promptContent,
  summaryContent,
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
  // let treatmentDateRequirement = item[VA_TREATMENT_BEFORE_2005_KEY];
  // const issuesRequirement = item.issues?.length;
  // if (item[VA_TREATMENT_BEFORE_2005_KEY] === 'Y') {
  //   treatmentDateRequirement =
  //     item[VA_TREATMENT_BEFORE_2005_KEY] && item[VA_TREATMENT_MONTH_YEAR_KEY];
  // }
  // return (
  //   issuesRequirement &&
  //   item[VA_TREATMENT_LOCATION_KEY] &&
  //   treatmentDateRequirement
  // );
};

/**
 * This is the config object for the VA evidence list & loop
 * Here, we can also configure the content on the summary page
 * including the layout of the evidence cards for review
 */
/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'privateEvidence',
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
    privacyAgreementAccepted: {},
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const detailsPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: ({ formContext }) => detailsContent.title(formContext),
      nounSingular: options.nounSingular,
    }),
    name: textUI(detailsContent.locationLabel),
    address: addressNoMilitaryUI({
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      [PRIVATE_LOCATION_DETAILS_KEY]: textSchema,
    },
    required: [PRIVATE_LOCATION_DETAILS_KEY],
  },
};

// /** @returns {PageSchema} */
// const datePromptPage = {
//   uiSchema: {
//     ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) =>
//       datePromptContent.title(formData),
//     ),
//     [VA_TREATMENT_BEFORE_2005_KEY]: radioUI({
//       title: datePromptContent.label,
//       labels: datePromptContent.options,
//       errorMessages: {
//         required: datePromptContent.requiredError,
//       },
//     }),
//   },
//   schema: {
//     type: 'object',
//     properties: {
//       [VA_TREATMENT_BEFORE_2005_KEY]: {
//         type: 'string',
//         enum: ['Y', 'N'],
//       },
//     },
//     required: [VA_TREATMENT_BEFORE_2005_KEY],
//   },
// };

// /** @returns {PageSchema} */
// const dateDetailsPage = {
//   uiSchema: {
//     ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) =>
//       dateDetailsContent.title(formData),
//     ),
//     [VA_TREATMENT_MONTH_YEAR_KEY]: currentOrPastMonthYearDateUI({
//       title: dateDetailsContent.label,
//       errorMessages: {
//         required: dateDetailsContent.requiredError,
//       },
//     }),
//   },
//   schema: {
//     type: 'object',
//     properties: {
//       [VA_TREATMENT_MONTH_YEAR_KEY]: currentOrPastMonthYearDateSchema,
//     },
//     required: [VA_TREATMENT_MONTH_YEAR_KEY],
//   },
// };

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
  privateAuthorization: pageBuilder.itemPage({
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
    depends: redesignActive && hasPrivateEvidenceRecords,
    // ------- END REMOVE
  }),
  privateDetails: pageBuilder.itemPage({
    title: '',
    path: EVIDENCE_URLS.privateDetails,
    uiSchema: detailsPage.uiSchema,
    schema: detailsPage.schema,
    // ------- REMOVE toggle check when new design toggle is removed
    depends: redesignActive && hasPrivateEvidenceRecords,
    // ------- END REMOVE
  }),
  // issues: pageBuilder.itemPage({
  //   title: '',
  //   path: EVIDENCE_URLS.vaIssues,
  //   uiSchema: issuesPage.uiSchema,
  //   schema: issuesPage.schema,
  //   // Issues requires a custom page because array builder does not
  //   // natively support checkboxes with dynamic labels
  //   CustomPage: props =>
  //     Issues({
  //       ...props,
  //       // resolve prop warning that the index is a string rather than a number
  //       pagePerItemIndex: +props.pagePerItemIndex,
  //     }),
  //   // ------- REMOVE toggle check when new design toggle is removed
  //   depends: redesignActive && hasPrivateEvidenceRecords,
  //   // ------- END REMOVE
  // }),
  // treatmentDatePrompt: pageBuilder.itemPage({
  //   title: 'Treatment date prompt',
  //   path: EVIDENCE_URLS.vaTreatmentDatePrompt,
  //   uiSchema: datePromptPage.uiSchema,
  //   schema: datePromptPage.schema,
  //   // ------- REMOVE toggle check when new design toggle is removed
  //   depends: redesignActive && hasPrivateEvidenceRecords,
  //   // ------- END REMOVE
  // }),
  // treatmentDate: pageBuilder.itemPage({
  //   title: 'Treatment date',
  //   path: EVIDENCE_URLS.vaTreatmentDateDetails,
  //   uiSchema: dateDetailsPage.uiSchema,
  //   schema: dateDetailsPage.schema,
  //   depends: formData => {
  //     const evidenceEntriesCount = formData?.privateEvidence?.length || 1;
  //     const currentIndex = evidenceEntriesCount - 1;
  //     return (
  //       // ------- REMOVE toggle check when new design toggle is removed
  //       redesignActive(formData) &&
  //       // ------- END REMOVE
  //       hasTreatmentBefore2005(formData, currentIndex) &&
  //       hasPrivateEvidenceRecords(formData)
  //     );
  //   },
  // }),
}));
