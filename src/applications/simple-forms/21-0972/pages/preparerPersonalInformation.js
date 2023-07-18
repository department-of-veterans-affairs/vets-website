import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description':
      'By filling out this form, the VA will be able to accept benefit applications signed by you on behalf of veterans and claimants. The information collected is used to contact you, the alternate signer, for verification purposes.',
    preparerFullName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      preparerFullName: fullNameNoSuffixSchema,
    },
  },
};
