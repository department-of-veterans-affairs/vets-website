import {
  titleUI,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateWhiteSpace } from 'platform/forms/validations';

const uiSchema = {
  ...titleUI('Your VA education benefits history'),
  vaBenefitProgram: {
    ...textareaUI({
      title:
        'Please enter all VA education benefits you have previously applied for',
      charcount: true,
      validations: [validateWhiteSpace],
      errorMessages: {
        maxLength:
          'You are over the character limit. Please shorten your text.',
      },
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    vaBenefitProgram: {
      type: 'string',
      minLength: 1,
      maxLength: 500,
    },
  },
  required: ['vaBenefitProgram'],
};

export { schema, uiSchema };
