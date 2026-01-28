import {
  titleUI,
  textUI,
  textSchema,
  firstNameLastNameNoSuffixSchema,
  firstNameLastNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateWhiteSpace } from 'platform/forms/validations';

export default {
  uiSchema: {
    ...titleUI('Officials and faculty information'),
    fullName: firstNameLastNameNoSuffixUI(),
    title: {
      ...textUI({
        title: 'Title',
        validations: [validateWhiteSpace],
        errorMessages: {
          required: 'Enter a title',
        },
      }),
    },
  },

  schema: {
    type: 'object',
    properties: {
      fullName: firstNameLastNameNoSuffixSchema,
      title: { ...textSchema, maxLength: 100 },
    },
    required: ['fullName', 'title'],
  },
};
