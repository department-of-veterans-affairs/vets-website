import merge from 'lodash/merge';

import bankAccountUI from 'platform/forms/definitions/bankAccount';

const defaults = {
  required: [],
};

export default function createDirectDepositPage(schema, options) {
  const mergedOptions = { ...defaults, ...options };
  const { required } = mergedOptions;
  const { bankAccount } = schema.definitions;

  return {
    title: 'Direct deposit',
    path: 'personal-information/direct-deposit',
    initialData: {},
    uiSchema: {
      'ui:title': 'Direct deposit',
      bankAccount: bankAccountUI,
    },
    schema: {
      type: 'object',
      properties: {
        bankAccount: merge({}, bankAccount, {
          required,
        }),
      },
    },
  };
}
