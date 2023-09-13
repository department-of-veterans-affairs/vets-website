import PayrollDeductionCheckList from '../../../components/householdIncome/PayrollDeductionChecklist';

export const uiSchema = {
  spousePayrollDeductionChecklist: {
    'ui:title':
      'Which of the following payroll deductions does your spouse pay?',
    'ui:widget': PayrollDeductionCheckList,
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    spousePayrollDeductionChecklist: {
      type: 'boolean',
    },
  },
};
