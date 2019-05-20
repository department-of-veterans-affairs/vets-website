import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function PaymentInformation2FARequired() {
  return (
    <AlertBox
      status="success"
      isVisible
      headline="You’ll need to set up 2-factor authentication before you can edit your direct deposit information."
    >
      <>
        <p>
          We require this to help protect your bank account information and
          prevent fraud.
        </p>
        <p>
          Authentication gives you an extra layer of security by letting you
          into your account only after you’ve signed in with a password and a
          6-digit code sent directly to your mobile or home phone. This helps to
          make sure that no one but you can access your account—even if they get
          your password.
        </p>
        <a className="usa-button-primary va-button-primary" href="/account">
          Set up 2-factor authentication
        </a>
      </>
    </AlertBox>
  );
}
