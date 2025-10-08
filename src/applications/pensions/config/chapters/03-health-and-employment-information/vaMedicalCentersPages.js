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
    summaryTitleWithoutItems: 'Treatment from VA medical facilities',
    cancelAddYes: 'Yes, cancel adding this VA medical facility',
    cancelAddNo: 'No',
    cancelEditYes: 'Yes, cancel editing this VA medical facility',
    cancelEditNo: 'No',
    cancelNo: 'No',
    deleteTitle: 'Delete VA medical facility',
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
      title: 'VA medical facilities',
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
