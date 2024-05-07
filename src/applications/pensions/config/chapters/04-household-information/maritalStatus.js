import {
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

const { maritalStatus } = fullSchemaPensions.definitions;

const maritalStatusOptions = {
  MARRIED: 'Married',
  NEVER_MARRIED: 'Never Married',
  SEPARATED: 'Separated',
  WIDOWED: 'Widowed',
  DIVORCED: 'Divorced',
};

/** @type {PageSchema} */
export default {
  title: 'Marital status',
  path: 'household/marital-status',
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
      maritalStatus,
    },
  },
};
