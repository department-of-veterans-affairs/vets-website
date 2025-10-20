import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { showMultiplePageResponse } from '../../../helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'vaMedicalCenters',
  nounSingular: 'VA medical center',
  nounPlural: 'VA medical centers',
  required: false,
  isItemIncomplete: item => !item?.medicalCenter, // include all required fields here
  text: {
    getItemName: item => item?.medicalCenter,
    summaryTitleWithoutItems: 'Treatment from VA medical centers',
    alertItemUpdated: 'Your VA medical center information has been updated',
    alertItemDeleted: 'Your VA medical center information has been deleted',
    cancelAddTitle: 'Cancel adding this VA medical center',
    cancelAddYes: 'Yes, cancel adding this VA medical center',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this VA medical center',
    cancelEditYes: 'Yes, cancel editing this VA medical center',
    cancelEditNo: 'No',
    cancelNo: 'No',
    deleteTitle: 'Delete this VA medical center',
    deleteNo: 'No',
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAddingVaMedicalCenters': arrayBuilderYesNoUI(options, {
      title: 'Have you received treatment from a VA medical center?',
      labelHeaderLevel: ' ',
      hint: null,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingVaMedicalCenters': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingVaMedicalCenters'],
  },
};

/** @returns {PageSchema} */
const vaMedicalCenterPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'VA medical center',
      nounSingular: options.nounSingular,
      lowerCase: false,
      hasMultipleItemPages: false,
    }),
    medicalCenter: textUI('VA medical center'),
  },
  schema: {
    type: 'object',
    properties: {
      medicalCenter: textSchema,
    },
    required: ['medicalCenter'],
  },
};

export const vaMedicalCentersPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    vaMedicalCentersSummary: pageBuilder.summaryPage({
      title: 'VA medical centers',
      path: 'medical/history/va-medical-centers/summary',
      depends: () => showMultiplePageResponse(),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    vaMedicalCenterPage: pageBuilder.itemPage({
      title: 'VA medical center',
      path: 'medical/history/va-medical-centers/:index/medical-center',
      depends: () => showMultiplePageResponse(),
      uiSchema: vaMedicalCenterPage.uiSchema,
      schema: vaMedicalCenterPage.schema,
    }),
  }),
);
