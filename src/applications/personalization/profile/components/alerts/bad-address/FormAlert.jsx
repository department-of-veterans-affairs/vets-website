import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function FormAlert() {
  return (
    <VaAlert
      status="warning"
      background-only
      show-icon
      data-testid="bad-address-form-alert"
      className="vads-u-margin-top--1 vads-u-font-weight--normal"
    >
      <p className="vads-u-margin--0">Review your Address</p>
      <va-additional-info trigger="What to do if your address is already correct">
        <p>
          Select Edit to review your address again. Then select Update to save
          and confirm.
        </p>
      </va-additional-info>
    </VaAlert>
  );
}
