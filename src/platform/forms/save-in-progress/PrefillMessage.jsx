import React from 'react';

const message =
  'We’ve prefilled some of your information from your account. If you need to correct anything, you can edit the form fields below.';

export default function PrefillMessage({ children, formContext }) {
  if (!formContext.prefilled) {
    return null;
  }

  return (
    <div className="usa-alert usa-alert-info background-color-only schemaform-prefill-message">
      <va-icon icon="info" size={3} />
      {children || message}
    </div>
  );
}
