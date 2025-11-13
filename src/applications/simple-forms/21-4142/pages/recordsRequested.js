import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import {
  titleUI,
  textUI,
  textareaUI,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

import { providerFacilityFields } from '../definitions/constants';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: providerFacilityFields.parentObject,
  nounSingular: 'treatment record',
  nounPlural: 'treatment records',
  required: true,
  isItemIncomplete: item =>
    !item?.[providerFacilityFields.providerFacilityName] ||
    !item?.[providerFacilityFields.providerFacilityAddress] ||
    !item?.[providerFacilityFields.conditionsTreated] ||
    !item?.[providerFacilityFields.treatmentDateRange],
  maxItems: 5,
  text: {
    getItemName: item => item[providerFacilityFields.providerFacilityName],
    cardDescription: item =>
      `${formatReviewDate(
        item?.[providerFacilityFields.treatmentDateRange].from,
      )} - ${formatReviewDate(
        item?.[providerFacilityFields.treatmentDateRange].to,
      )}`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      'Treatment Records',
      `In the next few questions, we'll ask you about the treatment records you're requesting. You must add at least one treatment request. You may add up to ${
        options.maxItems
      }.`,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/**
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasTreatmentRecords': arrayBuilderYesNoUI(options),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasTreatmentRecords': arrayBuilderYesNoSchema,
    },
    required: ['view:hasTreatmentRecords'],
  },
};

/** @returns {PageSchema} */
const nameAndAddressPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Tell us where the patient received treatment',
      nounSingular: options.nounSingular,
    }),
    [providerFacilityFields.providerFacilityName]: textUI({
      title: 'Name of private provider or hospital',
      errorMessages: {
        required:
          'Enter the name of the private provider or hospital where you received treatment',
      },
      hint: '(Max. 60 characters)',
    }),
    [providerFacilityFields.providerFacilityAddress]: addressNoMilitaryUI({
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      [providerFacilityFields.providerFacilityName]: {
        type: 'string',
        maxLength: 60,
      },
      [providerFacilityFields.providerFacilityAddress]: addressNoMilitarySchema(
        { omit: ['street3'] },
      ),
    },
    required: [
      providerFacilityFields.providerFacilityName,
      providerFacilityFields.providerFacilityAddress,
    ],
  },
};

/** @returns {PageSchema} */
const conditionsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Conditions treated at ${
          formData[providerFacilityFields.providerFacilityName]
        }`,
    ),
    [providerFacilityFields.conditionsTreated]: textareaUI({
      title:
        'List the conditions the person received treatment for at this facility.',
      errorMessages: {
        required:
          'You must enter at least one condition the person received treatment for at this facility',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      [providerFacilityFields.conditionsTreated]: {
        type: 'string',
        maxLength: 60,
      },
    },
    required: [providerFacilityFields.conditionsTreated],
  },
};

/** @returns {PageSchema} */
const treatmentDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Treatment dates at ${
          formData[providerFacilityFields.providerFacilityName]
        }`,
    ),
    [providerFacilityFields.treatmentDateRange]: currentOrPastDateRangeUI(
      {
        title: 'First treatment date (you can estimate)',
        errorMessages: {
          required: 'Enter the date you first received treatment',
        },
      },
      {
        title: 'Last treatment date (you can estimate)',
        errorMessages: {
          required: 'Enter the date of your last treatment',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      [providerFacilityFields.treatmentDateRange]: currentOrPastDateRangeSchema,
    },
    required: [providerFacilityFields.treatmentDateRange],
  },
};

export default arrayBuilderPages(options, pageBuilder => ({
  recordsRequested: pageBuilder.introPage({
    title: 'Records requested',
    path: 'records-requested',
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  recordsRequestedSummary: pageBuilder.summaryPage({
    title: 'Review your medical providers',
    path: 'records-requested-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  recordsRequestedNameAndAddressPage: pageBuilder.itemPage({
    title: 'Provider Information',
    path: 'records-requested/:index/name-and-address',
    uiSchema: nameAndAddressPage.uiSchema,
    schema: nameAndAddressPage.schema,
  }),
  recordsRequestedConditionsPage: pageBuilder.itemPage({
    title: 'Conditions Treated',
    path: 'records-requested/:index/conditions',
    uiSchema: conditionsPage.uiSchema,
    schema: conditionsPage.schema,
  }),
  recordsRequestedTreatmentDatesPage: pageBuilder.itemPage({
    title: 'Treatment Dates',
    path: 'records-requested/:index/treatment-dates',
    uiSchema: treatmentDatesPage.uiSchema,
    schema: treatmentDatesPage.schema,
  }),
}));
