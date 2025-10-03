import React from 'react';

export default function SuccessConfirm() {
  return (
    <div className="vads-u-margin-y--2">
      <va-alert visible status="success">
        <h2 slot="headline">
          Thank you for confirming your contact email address
        </h2>
        <p>
          You can update the email address we have on file for you at any time
          in your VA.gov profile.
        </p>
      </va-alert>
    </div>
  );
}
