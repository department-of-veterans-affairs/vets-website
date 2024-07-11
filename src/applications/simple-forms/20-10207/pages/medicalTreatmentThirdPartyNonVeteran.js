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
      title: 'Where did the claimant receive medical treatment?',
      description:
        'List VA medical centers, Defense Department military treatment facilities, or private medical facilities where the claimant was treated. Provide the approximate date that the treatment started. You may add up to 5 facilities.',
      nounSingular: options.nounSingular,
    }),
    facilityName: {
      'ui:title': 'Name of treatment facility',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required:
          'Enter the name of the facility where the claimant received treatment',
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
        `When did the claimant receive treatment at ${formData.facilityName}?`,
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
          'Has the claimant received medical treatment for any medical issues related to this request?',
        labels: {
          Y: 'Yes, the claimant has received medical treatment',
          N: 'No, the claimant has not received medical treatment',
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
  medicalTreatmentSummaryThirdPartyNonVeteran: pageBuilder.summaryPage({
    title: 'Review the claimant’s medical treatments',
    path: 'medical-treatments-third-party-non-veteran',
    depends: formData =>
      formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  medicalTreatmentNameAndAddressPageThirdPartyNonVeteran: pageBuilder.itemPage({
    title: 'Where did the claimant receive medical treatment?',
    path: 'medical-treatments-third-party-non-veteran/:index/name-and-address',
    depends: formData =>
      formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
    uiSchema: nameAndAddressPage.uiSchema,
    schema: nameAndAddressPage.schema,
  }),
  medicalTreatmentTreatmentDatesPageThirdPartyNonVeteran: pageBuilder.itemPage({
    title: 'When did the claimant receive medical treatment?',
    path: 'medical-treatments-third-party-non-veteran/:index/treatment-date',
    depends: formData =>
      formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
    uiSchema: treatmentDatePage.uiSchema,
    schema: treatmentDatePage.schema,
  }),
}));
