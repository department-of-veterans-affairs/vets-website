import PayrollDeductionInputList from '../../../components/PayrollDeductionInputList';
import { validateAddlIncomeValues } from '../../../utils/validations';
import { SelectedJobEmployerTitle } from '../../../components/SelectedJobEmployerTitle';

export const uiSchema = {
  'ui:title': '',
  additionalIncome: {
    'ui:title': SelectedJobEmployerTitle,
    'ui:field': PayrollDeductionInputList,
    'ui:options': {
      hideOnReview: true,
    },
    payrollDeductionRecords: {
      'ui:title': 'payrollDeductionRecords',
      'ui:validations': [validateAddlIncomeValues],
      items: {
        name: {
          'ui:title': 'Type of income',
        },
        amount: {
          'ui:title': 'Monthly income amount',
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    additionalIncome: {
      type: 'object',
      properties: {
        payrollDeductionRecords: {
          type: 'array',
          items: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};
