import React from 'react';
import FormFooter from '../FormFooter';

export default function ConfirmationError() {
  return (
    <div className="meb-confirmation-page meb-confirmation-page_denied">
      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
      >
        <h3 slot="headline">There was an error processing your application.</h3>
        <div>Please try again later.</div>
      </va-alert>

      <FormFooter />
    </div>
  );
}
