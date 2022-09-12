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
      <p className="vads-u-margin--0">Review and update your address.</p>
      <va-additional-info trigger="What to do if your address is already correct">
        <p>
          Select <strong className="vads-u-font-weight--bold">Edit</strong> to
          review your address again. Then select{' '}
          <strong className="vads-u-font-weight--bold">Update</strong> to save
          and confirm.
        </p>
      </va-additional-info>
    </VaAlert>
  );
}
