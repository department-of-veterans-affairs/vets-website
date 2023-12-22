import {
  radioUI,
  radioSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

const maritalStatusOptions = {
  MARRIED: 'Married',
  NEVER_MARRIED: 'Never Married',
  SEPARATED: 'Separated',
  WIDOWED: 'Widowed',
  DIVORCED: 'Divorced',
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Martial status',
    maritalStatus: radioUI({
      title: 'What’s your marital status?',
      labels: maritalStatusOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['maritalStatus'],
    properties: {
      maritalStatus: radioSchema(Object.keys(maritalStatusOptions)),
    },
  },
};
