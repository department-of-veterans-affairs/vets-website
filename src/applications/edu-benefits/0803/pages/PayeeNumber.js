// @ts-check
import {
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI(
    'Your VA payee number',
    'If you are a beneficiary using Chapter 35 Survivors’ and Dependents’ Educational Assistance Program (DEA), enter your payee number. If you are a Veteran, you can skip this question.',
  ),
  payeeNumber: {
    ...textUI({
      title: 'Payee number',
      hint: 'Maximum limit is 2 characters, can be letters or numbers',
      charcount: true,
      validations: [
        (errors, field) => {
          if (!/^[\w\s]{0,2}$/.test(field)) {
            errors.addError('Enter your response in a valid format');
          }
        },
      ],
    }),
  },
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
