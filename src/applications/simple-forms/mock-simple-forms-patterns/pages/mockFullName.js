// @ts-check
import {
  titleUI,
  fullNameUI,
  fullNameSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Web component v3 full name'),
    wcv3SpouseFullNameNew: fullNameUI(),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3SpouseFullNameNew: fullNameSchema,
    },
    required: [],
  },
};
