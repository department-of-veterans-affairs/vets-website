import PayrollDeductionCheckList from '../../../components/householdIncome/PayrollDeductionChecklist';

export const uiSchema = {
  payrollDeductionCheckList: {
    'ui:title': 'Which of the following payroll deductions do you pay?',
    'ui:widget': PayrollDeductionCheckList,
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    payrollDeductionCheckList: {
      type: 'boolean',
    },
  },
};
