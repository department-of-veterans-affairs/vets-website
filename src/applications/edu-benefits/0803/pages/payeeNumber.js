// @ts-check
import {
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your VA payee number',
      'If you are a beneficiary, enter your payee number. If you are a Veteran, you can skip this question.',
    ),
    payeeNumber: {
      ...textUI({
        title: 'Payee number',
        hint: 'Maximum limit is 2 characters, can be letters or numbers',
        charcount: true,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      payeeNumber: {
        type: 'string',
        maxLength: 2,
      },
    },
  },
};
