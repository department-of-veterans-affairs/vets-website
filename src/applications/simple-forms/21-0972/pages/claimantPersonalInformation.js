import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    claimantFullName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      claimantFullName: fullNameNoSuffixSchema,
    },
  },
};
