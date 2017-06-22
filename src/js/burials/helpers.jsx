import React from 'react';

import { transformForSubmit } from '../common/schemaform/helpers';

export const expensesWarning = (
  <div className="usa-alert usa-alert-info">
    <div className="usa-alert-body">
      <span>Note: if you did not incur any expenses, your claim may be denied</span>
    </div>
  </div>
);

export function transform(formConfig, form) {
  // delete form.data.privacyAgreementAccepted;
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    burialClaim: {
      form: formData
    }
  });
}
