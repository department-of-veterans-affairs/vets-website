import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description':
      'We use this information to contact you and verify other details.',
    preparerFullName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      preparerFullName: fullNameNoSuffixSchema,
    },
  },
};
