// @ts-check
import {
  firstNameLastNameNoSuffixSchema,
  firstNameLastNameNoSuffixUI,
  emailUI,
  emailSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    schoolCertifyingOfficial: {
      ...titleUI(
        'Please provide your institution’s Certifying Official information',
      ),
      fullName: firstNameLastNameNoSuffixUI(),
      email: emailUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      schoolCertifyingOfficial: {
        type: 'object',
        properties: {
          fullName: firstNameLastNameNoSuffixSchema,
          email: emailSchema,
        },
        required: ['fullName', 'email'],
      },
    },
  },
};
