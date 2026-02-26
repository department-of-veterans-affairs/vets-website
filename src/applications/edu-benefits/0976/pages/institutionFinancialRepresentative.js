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
    financialRepresentative: {
      ...titleUI(
        'Please provide your institution’s financial representative information.',
      ),
      fullName: firstNameLastNameNoSuffixUI(),
      email: emailUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      financialRepresentative: {
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
