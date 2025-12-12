import {
  titleUI,
  firstNameLastNameNoSuffixUI,
  firstNameLastNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your name'),
    fullName: firstNameLastNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: firstNameLastNameNoSuffixSchema,
    },
    required: ['fullName'],
  },
};
