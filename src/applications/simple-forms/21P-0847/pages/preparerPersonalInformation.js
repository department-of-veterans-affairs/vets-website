import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Substitute Claimant',
      'First, we’ll ask for your information as the person requesting to be the substitute claimant.',
    ),
    preparerName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      preparerName: fullNameNoSuffixSchema,
    },
  },
};
