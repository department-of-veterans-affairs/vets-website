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
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
        If your address is already correct, select{' '}
        <strong className="vads-u-font-weight--bold">Edit</strong> to review it
        again. Then select{' '}
        <strong className="vads-u-font-weight--bold">Update</strong> to save and
        confirm.
      </p>
    </VaAlert>
  );
}
