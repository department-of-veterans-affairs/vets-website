import {
  fullNameSchema,
  fullNameUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your name'),
    spouseFullName: fullNameUI(),
  },
  schema: {
    type: 'object',
    properties: {
      spouseFullName: fullNameSchema,
    },
    required: ['spouseFullName'],
  },
};
