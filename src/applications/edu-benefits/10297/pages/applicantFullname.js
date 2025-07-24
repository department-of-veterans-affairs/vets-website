import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Enter your full name'),
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
