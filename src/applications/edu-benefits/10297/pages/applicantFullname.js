import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Enter your full name'),
  applicantFullName: fullNameNoSuffixUI(),
};

const schema = {
  type: 'object',
  properties: {
    applicantFullName: fullNameNoSuffixSchema,
  },
  required: ['applicantFullName'],
};

export { schema, uiSchema };
