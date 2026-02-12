import {
  arrayBuilderItemSubsequentPageTitleUI,
  addressUI,
  addressSchema,
  radioUI,
  radioSchema,
  yesNoUI,
  yesNoSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @returns {PageSchema} */
export const studentIncomePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student\u2019s income'),
    studentIncome: radioUI({
      title: 'Did this student have an income in the last 365 days?',
      hint:
        'Answer this question only if you are adding this dependent to your pension.',
      labels: {
        Y: 'Yes',
        N: 'No',
        NA: 'This question doesn\u2019t apply to me',
      },
      required: (_chapterData, _index, formData) =>
        formData?.vaDependentsNetWorthAndPension,
      updateUiSchema: () => ({
        'ui:options': {
          hint: '',
        },
      }),
      updateSchema: (formData = {}, formSchema) => {
        const { vaDependentsNetWorthAndPension } = formData;

        if (!vaDependentsNetWorthAndPension) {
          return formSchema;
        }

        return {
          ...radioSchema(['Y', 'N']),
        };
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      studentIncome: radioSchema(['Y', 'N', 'NA']),
    },
  },
};

/** @returns {PageSchema} */
export const studentAddressPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student\u2019s address'),
    address: {
      ...addressUI({
        title: '',
        labels: {
          militaryCheckbox:
            'The student receives mail outside of the United States on a U.S. military base.',
        },
      }),
      city: {
        ...addressUI().city,
        'ui:validations': [
          (errors, city, formData) => {
            const address = formData?.address;
            const cityStr = city?.trim().toUpperCase();

            if (city?.length > 30) {
              errors.addError('City must be 30 characters or less');
            }

            if (
              address &&
              ['APO', 'FPO', 'DPO'].includes(cityStr) &&
              address.isMilitary !== true
            ) {
              errors.addError('Enter a valid city name');
            }
          },
        ],
      },
    },
  },
  schema: {
    type: 'object',
    required: ['address'],
    properties: {
      address: addressSchema(),
    },
  },
};

/** @returns {PageSchema} */
export const studentMaritalStatusPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student\u2019s marital status',
    ),
    wasMarried: {
      ...yesNoUI('Has this student ever been married?'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    required: ['wasMarried'],
    properties: {
      wasMarried: yesNoSchema,
    },
  },
};

/** @returns {PageSchema} */
export const studentMarriageDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student\u2019s marriage date',
    ),
    marriageDate: currentOrPastDateUI({
      title: 'Date of marriage',
      required: () => true,
    }),
    'ui:options': {
      updateSchema: (formData, schema, _uiSchema, index) => {
        const itemData = formData?.studentInformation?.[index] || {};

        if (itemData?.wasMarried !== true) {
          itemData.marriageDate = undefined;
          return schema;
        }

        return {
          ...schema,
          required: ['marriageDate'],
        };
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      marriageDate: currentOrPastDateSchema,
    },
  },
};
