import {
  titleUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

// Allows any letter (case-insensitive), number, or whitespace character.
const letterOrNumberRegex = /^[[a-zA-Z0-9\s]{0,2}$/;

const uiSchema = {
  ...titleUI(
    'Your VA payee number',
    'If you are a beneficiary, enter your payee number. If you are a Veteran, you can skip this question.',
  ),
  payeeNumber: textUI({
    title: 'Payee number',
    hint: 'Maximum limit is 2 characters, can be letters or numbers',
    validations: [
      (errors, field) => {
        if (!letterOrNumberRegex.test(field)) {
          errors.addError('Enter your response in a valid format');
        }
      },
    ],
  }),
};

const schema = {
  type: 'object',
  properties: {
    payeeNumber: {
      type: 'string',
      maxLength: 2,
    },
  },
};

export { schema, uiSchema };
