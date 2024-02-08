import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordCustomProfileEvent } from '@@vap-svc/util/analytics';

const recordView = () => {
  recordCustomProfileEvent({
    title: 'Contact Info',
    status: 'BAI Views',
  });
};

export default function FormAlert() {
  return (
    <VaAlert
      status="warning"
      background-only
      data-testid="bad-address-form-alert"
      className="vads-u-margin-top--1 vads-u-font-weight--normal vads-u-margin-bottom--2"
      onVa-component-did-load={recordView}
      uswds
    >
      <p className="vads-u-margin--0">Review and update your address.</p>
      <p className="vads-u-padding-top--1 vads-u-margin-y--0 small-desktop-screen:vads-u-padding-right--5">
        If your address is already correct, select{' '}
        <strong className="vads-u-font-weight--bold">Edit</strong> to review it
        again. Then select{' '}
        <strong className="vads-u-font-weight--bold">Update</strong> to save and
        confirm.
      </p>
    </VaAlert>
  );
}
