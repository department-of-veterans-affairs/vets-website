import React from 'react';

export const expensesWarning = (
  <div className="usa-alert usa-alert-info">
    <div className="usa-alert-body">
      <span>Note: if you did not incur any expenses, your claim may be denied</span>
    </div>
  </div>
);

export function fileHelp({ formContext }) {
  if (formContext.reviewMode) {
    return <p/>;
  }

  return (
    <p>
      Files we accept: pdf, jpg, png<br/>
      Maximum file size: 2MB
    </p>
  );
}
