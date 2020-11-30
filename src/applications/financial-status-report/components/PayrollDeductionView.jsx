import React from 'react';

const PayrollDeductionView = ({ formData }) => {
  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <span>Deduction type: {formData.deductionType}</span>
      <span> Deduction amount: {formData.deductionAmout}</span>
    </div>
  );
};

export default PayrollDeductionView;
