import React from 'react';
import environment from 'platform/utilities/environment';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
// import { getAddOrEditMode } from '../../utils/evidence';
import {
  ATTACHMENTS_OTHER,
  EVIDENCE_URLS,
  EVIDENCE_UPLOAD_URL,
  UPLOADED_EVIDENCE_PROMPT_KEY,
} from '../../constants';
import { MAX_FILE_SIZE_BYTES } from '../../../shared/constants';
import { EVIDENCE_UPLOAD_API } from '../../constants/apis';
import { redesignActive } from '../../utils';
import {
  detailsContent,
  promptContent,
  summaryContent,
} from '../../content/evidence/upload';

/**
 * This is how we determine whether all of the info for one
 * evidence record is complete. This is what the summary page
 * uses to display an error or not
 * @param {object} item
 * @returns bool
 */
// const itemIsComplete = item => {
//   let treatmentDateRequirement = item[VA_TREATMENT_BEFORE_2005_KEY];

//   if (item[VA_TREATMENT_BEFORE_2005_KEY] === 'Y') {
//     treatmentDateRequirement =
//       item[VA_TREATMENT_BEFORE_2005_KEY] && item[VA_TREATMENT_MONTH_YEAR_KEY];
//   }

//   return item[VA_TREATMENT_LOCATION_KEY] && treatmentDateRequirement;
// };

/**
 * This is the config object for the VA evidence list & loop
 * Here, we can also configure the content on the summary page
 * including the layout of the evidence cards for review
 */
/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'uploadEvidence',
  nounSingular: 'record',
  nounPlural: 'records',
  required: false,
  // isItemIncomplete: item => !itemIsComplete(item),
  maxItems: 100,
  // text: {
  //   alertItemUpdated: ({ itemData }) =>
  //     summaryContent.alertItemUpdatedText(itemData),
  //   cardDescription: item => summaryContent.cardDescription(item),
  //   getItemName: item => item?.[VA_TREATMENT_LOCATION_KEY],
  //   summaryTitle: summaryContent.titleWithItems,
  // },
};

const errorMessages = {
  errorMessages: {
    required: summaryContent.requiredError,
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
    [UPLOADED_EVIDENCE_PROMPT_KEY]: {
      ...arrayBuilderYesNoUI(
        options,
        {
          useFormsPattern: true,
          formHeading: promptContent.title,
          formDescription: summaryContent.description,
          title: promptContent.title,
          labels: summaryContent.options,
          formHeadingLevel: '3',
          labelHeaderLevel: null,
          hint: null,
          errorMessages,
        },
        {
          title: summaryContent.summaryTitle,
          labels: summaryContent.options,
          labelHeaderLevel: '4',
          hint: null,
          errorMessages,
        },
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [UPLOADED_EVIDENCE_PROMPT_KEY]: arrayBuilderYesNoSchema,
    },
    required: [UPLOADED_EVIDENCE_PROMPT_KEY],
  },
};

/** @returns {PageSchema} */
const uploadPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: detailsContent.title,
    }),
    'ui:description': detailsContent.description,
    uploadedEvidence: fileInputUI({
      title: detailsContent.inputLabel,
      labelHeaderLevel: '4',
      fileUploadUrl: `${environment.API_URL}${EVIDENCE_UPLOAD_API}`,
      accept: '.pdf',
      maxFileSize: MAX_FILE_SIZE_BYTES,
      required: true,
      formNumber: '20-0995',
      additionalInputRequired: true,
      additionalInputLabels: {
        documentType: { ...ATTACHMENTS_OTHER },
      },
      additionalInput: 
    }),
  },
  schema: {
    type: 'object',
    properties: {
      uploadedEvidence: fileInputSchema(),
    },
    required: ['uploadedEvidence'],
  },
};

/**
 * This is where the array builder gets page configuration.
 * Some items have blank titles because a title is required for the
 * pageBuilder config but the uiSchemas they use also require titles
 * which override the ones here
 */
export default arrayBuilderPages(options, pageBuilder => ({
  uploadEvidencePrompt: pageBuilder.summaryPage({
    title: '',
    path: EVIDENCE_URLS.uploadPrompt,
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
    depends: formData => redesignActive(formData),
  }),
  uploadEvidenceDetails: pageBuilder.itemPage({
    title: '',
    path: EVIDENCE_URLS.uploadDetails,
    uiSchema: uploadPage.uiSchema,
    schema: uploadPage.schema,
    depends: formData => redesignActive(formData),
  }),
}));
