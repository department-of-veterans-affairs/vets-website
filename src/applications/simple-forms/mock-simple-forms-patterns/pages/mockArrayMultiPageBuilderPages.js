import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';

const MAX_ITEMS = 5;

/** @type {ArrayBuilderOptions} */
export const employersOptions = {
  arrayPath: 'employers',
  nounSingular: 'employer',
  nounPlural: 'employers',
  isItemIncomplete: item =>
    !item?.name ||
    !item?.address?.country ||
    !item?.address?.city ||
    !item?.address?.street ||
    !item?.address?.postalCode,
  maxItems: MAX_ITEMS,
  text: {
    // if the value is null/undefined, it will use default text
    getItemName: item => item.name,
    cardDescription: item => `${item?.dateStart} - ${item?.dateEnd}`,
  },
};

/** @returns {PageSchema} */
export const employersSummaryPage = {
  uiSchema: {
    // cards above this autopopulated by the array builder
    'view:hasEmployment': yesNoUI({
      errorMessages: {
        required: 'Select yes if you have another employer to add',
      },
      updateUiSchema: formData => {
        return formData?.employers?.length
          ? {
              'ui:title': `Do you have another employer to report?`,
              'ui:options': {
                labelHeaderLevel: '4',
                hint: '',
                labels: {
                  Y: 'Yes, I have another employer to report',
                  N: 'No, I don’t have another employer to report',
                },
              },
            }
          : {
              'ui:title': `Do you have any employment, including self-employment for the last 5 years to report?`,
              'ui:options': {
                labelHeaderLevel: '3',
                hint:
                  'Include self-employment and military duty (including inactive duty for training).',
                labels: {
                  Y: 'Yes, I have employment to report',
                  N: 'No, I don’t have employment to report',
                },
              },
            };
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEmployment': yesNoSchema,
    },
    required: ['view:hasEmployment'],
  },
};

/** @returns {PageSchema} */
export const employersPageNameAndAddressPage = {
  uiSchema: {
    ...titleUI(
      () => {
        const isEdit = window.location.search.includes('edit=true');
        return isEdit
          ? 'Edit name and address of employer or unit'
          : 'Name and address of employer or unit';
      },
      () => {
        const isEdit = window.location.search.includes('edit=true');
        return isEdit
          ? 'We’ll take you through each of the sections of this employer for you to review and edit'
          : '';
      },
    ),
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
    dateStart: currentOrPastDateUI('Start date of employment'),
    dateEnd: currentOrPastDateUI('End date of employment'),
  },
  schema: {
    type: 'object',
    properties: {
      dateStart: currentOrPastDateSchema,
      dateEnd: currentOrPastDateSchema,
    },
    required: ['dateStart', 'dateEnd'],
  },
};
