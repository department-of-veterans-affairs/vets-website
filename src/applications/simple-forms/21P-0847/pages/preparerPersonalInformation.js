import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    rjsf: titleUI(
      'Substitute Claimant',
      'First, we’ll ask for your information as the person requesting to be the substitute claimant.',
    ),
    preparerName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      rjsf: titleSchema,
      preparerName: fullNameNoSuffixSchema,
    },
  },
};
