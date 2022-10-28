import React from 'react';
import PayrollDeductionCheckList from '../../../components/PayrollDeductionChecklist';
import { SelectedJobEmployerTitle } from '../../../components/SelectedJobEmployerTitle';

export const uiSchema = {
  'ui:title': SelectedJobEmployerTitle,
  payrollDeductionCheckList: {
    'ui:title': (
      <span className="vads-u-font-size--h4 vads-u-font-family--sans">
        Which of the following payroll deductions do you pay?
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
    payrollDeductionCheckList: {
      type: 'boolean',
    },
  },
};
