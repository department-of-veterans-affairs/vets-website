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
  arrayPath: 'federalMedicalCenters',
  nounSingular: 'federal medical center',
  nounPlural: 'federal medical centers',
  required: false,
  isItemIncomplete: item => !item?.medicalCenter, // include all required fields here
  text: {
    getItemName: item => item?.medicalCenter,
    summaryTitleWithoutItems: 'Treatment from federal medical centers',
    cancelAddTitle: 'Cancel adding this federal medical center',
    cancelAddYes: 'Yes, Cancel adding this federal medical center',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this federal medical center',
    cancelEditYes: 'Yes, Cancel editing this federal medical center',
    cancelEditNo: 'No',
    cancelNo: 'No',
    deleteTitle: 'Delete this federal medical center',
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
    'view:isAddingFederalMedicalCenters': arrayBuilderYesNoUI(options, {
      title:
        'Have you received treatment from any non-VA federal medical centers within the past year?',
      labelHeaderLevel: ' ',
      hint:
        'Examples of federal medical centers include military bases and prisons',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingFederalMedicalCenters': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingFederalMedicalCenters'],
  },
};

/** @returns {PageSchema} */
const federalMedicalCenterPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Federal medical center',
      nounSingular: options.nounSingular,
      hasMultipleItemPages: false,
    }),
    medicalCenter: textUI('Federal medical center'),
  },
  schema: {
    type: 'object',
    properties: {
      medicalCenter: textSchema,
    },
    required: ['medicalCenter'],
  },
};

export const federalMedicalCentersPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    federalMedicalCentersSummary: pageBuilder.summaryPage({
      title: 'Federal medical centers',
      path: 'medical/history/federal-medical-centers/summary',
      depends: () => showMultiplePageResponse(),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    federalMedicalCenterPage: pageBuilder.itemPage({
      title: 'Federal medical center',
      path: 'medical/history/federal-medical-centers/:index/medical-center',
      depends: () => showMultiplePageResponse(),
      uiSchema: federalMedicalCenterPage.uiSchema,
      schema: federalMedicalCenterPage.schema,
    }),
  }),
);
