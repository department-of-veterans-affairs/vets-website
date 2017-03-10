import * as bankAccount from '../../common/schemaform/definitions/bankAccount';

const directDeposit = {
  title: 'Direct deposit',
  path: 'personal-information/direct-deposit',
  initialData: {},
  uiSchema: {
    'ui:title': 'Direct deposit',
    bankAccount: bankAccount.uiSchema,
  },
  schema: {
    type: 'object',
    properties: {
      bankAccount: bankAccount.schema
    }
  }
};

export default directDeposit;
