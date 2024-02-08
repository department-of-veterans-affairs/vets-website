import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  titleUI,
  dateOfBirthSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Date web components'),
    dateWCV3: currentOrPastDateUI('Web component - Generic'),
    dateOfBirthWCV3: dateOfBirthUI('Web component - Date of birth'),
  },
  schema: {
    type: 'object',
    properties: {
      dateWCV3: currentOrPastDateSchema,
      dateOfBirthWCV3: dateOfBirthSchema,
    },
    required: ['dateWCV3'],
  },
};
