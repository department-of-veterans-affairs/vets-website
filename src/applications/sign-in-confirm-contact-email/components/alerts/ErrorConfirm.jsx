import React from 'react';

export default function ErrorConfirm() {
  return (
    <div className="vads-u-margin-y--2">
      <va-alert visible status="error">
        <h2 slot="headline">We couldn’t confirm your contact email</h2>
        <p>Please try again.</p>
      </va-alert>
    </div>
  );
}
