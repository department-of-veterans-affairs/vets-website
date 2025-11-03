import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
const schema = {
  type: 'object',
  properties: {
    nursingOrCustodialCare: {
      type: 'boolean',
    },
    medicaidCoverNursingHome: {
      type: 'boolean',
    },
    medicaidPerDiem: {
      type: 'number',
    },
    amountPaidToNursingHome: {
      type: 'number',
    },
    amountPaidByOthers: {
      type: 'number',
    },
    otherPaymentSource: {
      type: 'string',
    },
  },
};

/** @type {UISchema} */
const uiSchema = {
  ...titleUI('Nursing Care Information'),
  nursingOrCustodialCare: {
    'ui:title': 'Are you receiving nursing care or custodial care?',
    'ui:webComponentField': 'va-radio',
    'ui:options': {
      labels: {
        true: 'Yes',
        false: 'No',
      },
    },
  },
  medicaidCoverNursingHome: {
    'ui:title': 'Does Medicaid cover your stay in the nursing home?',
    'ui:webComponentField': 'va-radio',
    'ui:options': {
      labels: {
        true: 'Yes',
        false: 'No',
      },
    },
  },
  medicaidPerDiem: {
    'ui:title': 'Amount of Medicaid per diem',
    'ui:webComponentField': 'va-number-input',
    'ui:options': {
      widgetClassNames: 'vads-u-margin-bottom--2',
    },
  },
  amountPaidToNursingHome: {
    'ui:title': 'Amount you pay to nursing home out of your income (monthly)',
    'ui:webComponentField': 'va-number-input',
    'ui:options': {
      widgetClassNames: 'vads-u-margin-bottom--2',
    },
  },
  amountPaidByOthers: {
    'ui:title': 'Amount paid by family, friends, or other sources (monthly)',
    'ui:webComponentField': 'va-number-input',
    'ui:options': {
      widgetClassNames: 'vads-u-margin-bottom--2',
    },
  },
  otherPaymentSource: {
    'ui:title':
      'Name and relationship of person(s) who contribute to nursing home cost',
    'ui:webComponentField': 'va-textarea',
    'ui:options': {
      widgetClassNames: 'vads-u-margin-bottom--2',
    },
  },
};

export const nursingCareInformation = {
  uiSchema,
  schema,
};
