import React from 'react';

export default function FormAlert() {
  return (
    <va-alert
      status="warning"
      background-only
      show-icon
      data-testid="bad-address-form-alert"
    >
      <h2 slot="headline">Review your mailing address</h2>
      <p className="vads-u-margin--0">Review your Address</p>
    </va-alert>
  );
}
