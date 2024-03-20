import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

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
    ...titleUI('Marital status'),
    maritalStatus: radioUI({
      title: 'What’s your current marital status?',
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
