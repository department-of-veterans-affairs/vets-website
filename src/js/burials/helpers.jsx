import React from 'react';

export const expensesWarning = (
  <div className="usa-alert usa-alert-info">
    <div className="usa-alert-body">
      <span>Note: if you did not incur any expenses, your claim may be denied</span>
    </div>
  </div>
);

export const benefitsWarning = (
  <div className="usa-alert usa-alert-error">
    <div className="usa-alert-body">
      <span>No allowance or reimbursement will be issued if you are not claiming a benefit.</span>
    </div>
  </div>
);
