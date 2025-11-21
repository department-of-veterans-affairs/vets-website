import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Claimed spouse’s name'),
    claimantFullName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      claimantFullName: fullNameNoSuffixSchema,
    },
    required: ['claimantFullName'],
  },
};
