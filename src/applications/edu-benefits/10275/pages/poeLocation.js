import {
  titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI({
    title: 'Enter a point of contact for this location',
  }),
  fullName: fullNameNoSuffixUI(),
  email: emailUI({
    errorMessages: {
      required: 'Enter an email address',
    },
  }),
};

const schema = {
  type: 'object',
  properties: {
    fullName: fullNameNoSuffixSchema,
    email: emailSchema,
  },
  required: ['fullName', 'email'],
};

export { uiSchema, schema };
