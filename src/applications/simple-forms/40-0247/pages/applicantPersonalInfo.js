import {
  titleUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Tell us about yourself',
      'We’ll use this information in case we need to follow up with you about the request.',
    ),
    applicantFullName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      applicantFullName: fullNameNoSuffixSchema,
    },
    required: ['applicantFullName'],
  },
};
