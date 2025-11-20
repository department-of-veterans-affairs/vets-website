import {
  fullNameSchema,
  fullNameUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Claimed spouse name'),
    spouse: {
      fullName: fullNameUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      spouse: {
        type: 'object',
        properties: {
          fullName: fullNameSchema,
        },
        required: ['fullName'],
      },
    },
    required: ['spouse'],
  },
};
