import React from 'react';

export default function ErrorMessage() {
  return (
    <div className="usa-alert usa-alert-error schemaform-failure-alert">
      <div className="usa-alert-body">
        <p className="schemaform-warning-header"><strong>We’re sorry, the application didn’t go through.</strong></p>
        <p>You’ll have to start over. We suggest you wait 1 day while we fix this problem.</p>
        <p>If you’d like to complete this form by phone, please call 877-222-VETS (8387) and press 2, Monday-Friday, 7:00 a.m.to 7:00 p.m. (CT), Sat 9:00 a.m. to 5:30 p.m. (CT).</p>
      </div>
    </div>
  );
}
