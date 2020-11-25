import React from 'react';

const IncomeView = ({ formData }) => {
  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <span>Income type: {formData.incomeType}</span>
      <span> Employer name: {formData.employerName}</span>
      <span>Monthly amount: {formData.monthlyAmount}</span>
    </div>
  );
};

export default IncomeView;
