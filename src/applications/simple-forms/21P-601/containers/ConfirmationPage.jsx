import React from 'react';

export default function ConfirmationPage() {
  return (
    <div className="confirmation-page">
      <va-alert status="success" uswds>
        <h2 slot="headline">We've received your form</h2>
      </va-alert>
      <p>Thank you for submitting 21P-601.</p>
    </div>
  );
}
