import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import { PREPARER_TYPES } from '../config/constants';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'medicalTreatments',
  nounSingular: 'medical treatment',
  nounPlural: 'medical treatments',
  required: false,
  isItemIncomplete: item =>
    !item?.facilityName || !item.facilityAddress || !item.startDate,
  maxItems: 4,
  text: {
    getItemName: item => item.facilityName,
    cardDescription: item => `${formatReviewDate(item?.startDate)}`,
  },
};

/** @returns {PageSchema} */
const nameAndAddressPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Where did the Veteran receive medical treatment?',
      description:
        'List VA medical centers, Defense Department military treatment facilities, or private medical facilities where the Veteran was treated. Provide the approximate date that the treatment started. You may add up to 5 facilities.',
      nounSingular: options.nounSingular,
    }),
    facilityName: {
      'ui:title': 'Name of treatment facility',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required:
          'Enter the name of the facility where the Veteran received treatment',
      },
      'ui:options': {
        charcount: 40,
      },
    },
    facilityAddress: addressNoMilitaryUI({
      omit: ['street2', 'street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      facilityName: {
        type: 'string',
        maxLength: 40,
      },
      facilityAddress: addressNoMilitarySchema({
        omit: ['street2', 'street3'],
      }),
    },
    required: ['facilityName', 'facilityAddress'],
  },
};

/** @returns {PageSchema} */
const treatmentDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `When did the Veteran receive treatment at ${formData.facilityName}?`,
    ),
    startDate: currentOrPastDateUI({
      title: 'Approximate start date of treatment',
      errorMessages: {
        required: 'Enter the approximate date of when treatment began',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      startDate: currentOrPastDateSchema,
    },
    required: ['startDate'],
  },
};

/** @returns {PageSchema} */
const summaryPage = {
  uiSchema: {
    'view:hasReceivedMedicalTreatment': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Has the Veteran received medical treatment for any medical issues related to this request?',
        hideHint: true,
        labels: {
          Y: 'Yes, the Veteran has received medical treatment',
          N: 'No, the Veteran has not received medical treatment',
        },
      },
      {
        title: 'Do you have another medical treatment to add?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasReceivedMedicalTreatment': arrayBuilderYesNoSchema,
    },
    required: ['view:hasReceivedMedicalTreatment'],
  },
};

export default arrayBuilderPages(options, pageBuilder => ({
  medicalTreatmentSummaryThirdPartyVeteran: pageBuilder.summaryPage({
    title: 'Review the Veteran’s medical treatments',
    path: 'medical-treatments-third-party-veteran',
    depends: formData =>
      formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  medicalTreatmentNameAndAddressPageThirdPartyVeteran: pageBuilder.itemPage({
    title: 'Where did the Veteran receive medical treatment?',
    path: 'medical-treatments-third-party-veteran/:index/name-and-address',
    depends: formData =>
      formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
    uiSchema: nameAndAddressPage.uiSchema,
    schema: nameAndAddressPage.schema,
  }),
  medicalTreatmentTreatmentDatesPageThirdPartyVeteran: pageBuilder.itemPage({
    title: 'When did the Veteran receive medical treatment?',
    path: 'medical-treatments-third-party-veteran/:index/treatment-date',
    depends: formData =>
      formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
    uiSchema: treatmentDatePage.uiSchema,
    schema: treatmentDatePage.schema,
  }),
}));
