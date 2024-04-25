import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '../arrayBuilder/components/arrayBuilderPatterns';

/** @type {ArrayBuilderOptions} */
export const employersOptions = {
  arrayPath: 'employers',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: formData => formData?.arrayBuilderPatternFlowType === 'required',
  isItemIncomplete: item =>
    !item?.name ||
    !item?.address?.country ||
    !item?.address?.city ||
    !item?.address?.street ||
    !item?.address?.postalCode,
  maxItems: 5,
  text: {
    getItemName: item => item.name,
    cardDescription: item =>
      `${item?.dateRange?.from} - ${item?.dateRange?.to}`,
  },
};

/** @returns {PageSchema} */
export const employersIntroPage = {
  uiSchema: {
    ...titleUI(
      'Your employers',
      'In the next few questions, we’ll ask you about your employers. You must add at least one employer. You may add up to 5 employers.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
export const employersSummaryPage = {
  uiSchema: {
    'view:hasEmployment': arrayBuilderYesNoUI(
      employersOptions,
      {
        title:
          'Do you have any employment, including self-employment for the last 5 years to report?',
        hint:
          'Include self-employment and military duty (including inactive duty for training).',
        labels: {
          Y: 'Yes, I have employment to report',
          N: 'No, I don’t have employment to report',
        },
      },
      {
        title: 'Do you have another employer to report?',
        labels: {
          Y: 'Yes, I have another employer to report',
          N: 'No, I don’t have another employer to report',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEmployment': arrayBuilderYesNoSchema,
    },
    required: ['view:hasEmployment'],
  },
};

/** @returns {PageSchema} */
export const employersPageNameAndAddressPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Name and address of employer',
      nounSingular: employersOptions.nounSingular,
    }),
    name: {
      'ui:title': 'Name of employer',
      'ui:webComponentField': VaTextInputField,
    },
    address: addressNoMilitaryUI({ omit: ['street2', 'street3'] }),
  },
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      address: addressNoMilitarySchema({ omit: ['street2', 'street3'] }),
    },
    required: ['name'],
  },
};

/** @returns {PageSchema} */
export const employersDatesPage = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        formData?.name
          ? `Dates you were employed at ${formData.name}`
          : 'Dates you were employed',
    ),
    dateRange: currentOrPastDateRangeUI(
      'Start date of employment',
      'End date of employment',
      'End date must be after start date',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      dateRange: currentOrPastDateRangeSchema,
    },
  },
};
