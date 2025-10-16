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
  nounSingular: 'federal medical facility',
  nounPlural: 'federal medical facilities',
  required: false,
  isItemIncomplete: item => !item?.medicalCenter, // include all required fields here
  text: {
    getItemName: item => item?.medicalCenter,
    summaryTitleWithoutItems: 'Treatment from federal medical facilities',
    alertItemUpdated:
      'Your federal medical facility information has been updated',
    alertItemDeleted:
      'Your federal medical facility information has been deleted',
    cancelAddTitle: 'Cancel adding this federal medical facility',
    cancelAddYes: 'Yes, cancel adding this federal medical facility',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this federal medical facility',
    cancelEditYes: 'Yes, cancel editing this federal medical facility',
    cancelEditNo: 'No',
    cancelNo: 'No',
    deleteTitle: 'Delete this federal medical facility',
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
        'Have you received treatment from any non-VA federal medical facilities within the past year?',
      labelHeaderLevel: ' ',
      hint:
        'Examples of federal medical facilities include military bases and prisons',
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
      title: 'Federal medical facility',
      nounSingular: options.nounSingular,
      hasMultipleItemPages: false,
    }),
    medicalCenter: textUI('Federal medical facility'),
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
      title: 'Federal medical facilities',
      path: 'medical/history/federal-medical-centers/summary',
      depends: () => showMultiplePageResponse(),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    federalMedicalCenterPage: pageBuilder.itemPage({
      title: 'Federal medical facility',
      path: 'medical/history/federal-medical-centers/:index/medical-center',
      depends: () => showMultiplePageResponse(),
      uiSchema: federalMedicalCenterPage.uiSchema,
      schema: federalMedicalCenterPage.schema,
    }),
  }),
);
