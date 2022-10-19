import React from 'react';
import PayrollDeductionCheckList from '../../../components/PayrollDeductionChecklist';

export const uiSchema = {
  'ui:title': 'Your other income',
  payrollDeductionCheckList: {
    'ui:title': (
      <span className="vads-u-font-size--h4 vads-u-font-family--sans">
        Which of the following payroll deductions do you pay?
      </span>
    ),
    'ui:widget': PayrollDeductionCheckList,
    'ui:required': formData => {
      const {
        additionalIncome: { addlIncRecords = [] },
      } = formData;

      return !addlIncRecords.length;
    },
    'ui:errorMessages': {
      required: 'Please select at least one payroll deduction.',
    },
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
