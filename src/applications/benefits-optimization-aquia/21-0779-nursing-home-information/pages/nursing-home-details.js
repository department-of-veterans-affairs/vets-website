import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
const schema = {
  type: 'object',
  required: ['nursingHomeName', 'admissionDate'],
  properties: {
    nursingHomeName: {
      type: 'string',
    },
    nursingHomeAddress: {
      type: 'object',
      properties: {
        street: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        postalCode: { type: 'string' },
      },
    },
    admissionDate: {
      type: 'string',
      format: 'date',
    },
    medicaidNumber: {
      type: 'string',
    },
  },
};

/** @type {UISchema} */
const uiSchema = {
  ...titleUI('Nursing Home Information'),
  nursingHomeName: {
    'ui:title': 'Name of Nursing Home',
    'ui:webComponentField': 'va-text-input',
    'ui:options': {
      widgetClassNames: 'vads-u-margin-bottom--2',
    },
  },
  nursingHomeAddress: {
    'ui:title': 'Complete Mailing Address of Nursing Home',
    street: {
      'ui:title': 'Street address',
      'ui:webComponentField': 'va-text-input',
    },
    city: {
      'ui:title': 'City',
      'ui:webComponentField': 'va-text-input',
    },
    state: {
      'ui:title': 'State',
      'ui:webComponentField': 'va-select',
      'ui:options': {
        widgetClassNames: 'vads-u-margin-bottom--2',
      },
    },
    postalCode: {
      'ui:title': 'ZIP Code',
      'ui:webComponentField': 'va-text-input',
      'ui:options': {
        widgetClassNames: 'vads-u-margin-bottom--2',
      },
    },
  },
  admissionDate: {
    'ui:title': 'Date of Admission',
    'ui:webComponentField': 'va-date',
    'ui:description': 'Enter the date you were admitted to this nursing home',
  },
  medicaidNumber: {
    'ui:title': 'Medicaid Number (if applicable)',
    'ui:webComponentField': 'va-text-input',
  },
};

export const nursingHomeDetails = {
  uiSchema,
  schema,
};
