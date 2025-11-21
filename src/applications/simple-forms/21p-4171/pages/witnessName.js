import {
  fullNameSchema,
  fullNameUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your name'),
    witnessFullName: fullNameUI(),
  },
  schema: {
    type: 'object',
    properties: {
      witnessFullName: fullNameSchema,
    },
    required: ['witnessFullName'],
  },
};
