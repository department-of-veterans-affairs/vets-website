import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    preparerName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      preparerName: fullNameNoSuffixSchema,
    },
  },
};
