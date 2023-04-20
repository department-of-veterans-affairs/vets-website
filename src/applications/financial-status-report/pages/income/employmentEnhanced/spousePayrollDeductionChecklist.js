import React from 'react';
import PayrollDeductionCheckList from '../../../components/PayrollDeductionChecklist';

export const uiSchema = {
  spousePayrollDeductionChecklist: {
    'ui:title': (
      <span className="vads-u-font-size--h4 vads-u-font-family--sans">
        Which of the following payroll deductions does your spouse pay?
      </span>
    ),
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
