import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function FormAlert() {
  return (
    <VaAlert
      status="warning"
      background-only
      show-icon
      data-testid="bad-address-form-alert"
      className="vads-u-margin-top--1"
    >
      <h2 slot="headline">Review your mailing address</h2>
      <p className="vads-u-margin--0">Review your Address</p>
    </VaAlert>
  );
}
