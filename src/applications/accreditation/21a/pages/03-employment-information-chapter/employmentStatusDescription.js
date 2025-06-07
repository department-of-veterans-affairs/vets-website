import {
  textareaSchema,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Employment status description',
  path: 'employment-status-description',
  uiSchema: {
    describeEmployment: textareaUI('Describe your employment situation.'),
  },
  schema: {
    type: 'object',
    properties: {
      describeEmployment: textareaSchema,
    },
    required: ['describeEmployment'],
  },
};
