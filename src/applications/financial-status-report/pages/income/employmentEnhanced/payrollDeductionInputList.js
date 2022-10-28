import PayrollDeductionInputList from '../../../components/PayrollDeductionInputList';
import { SelectedJobEmployerTitle } from '../../../components/SelectedJobEmployerTitle';

export const uiSchema = {
  'ui:title': SelectedJobEmployerTitle,
  currEmployment: {
    'ui:field': PayrollDeductionInputList,
    'ui:options': {
      hideOnReview: true,
    },
    deductions: {
      'ui:title': 'payrollDeductionRecords',
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
    currEmployment: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          deductions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  },
};
