import {
  firstNameLastNameNoSuffixUI,
  firstNameLastNameNoSuffixSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your name'),
    firstLastName: firstNameLastNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      firstLastName: firstNameLastNameNoSuffixSchema,
    },
    required: ['firstLastName'],
  },
};
