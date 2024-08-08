import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import React from 'react';
import { useSelector } from 'react-redux';

export default function PrefillMessage() {
  const loggedIn = useSelector(isLoggedIn);
  return loggedIn ? (
    <>
      <va-alert
        close-btn-aria-label="Close notification"
        status="info"
        uswds
        visible
      >
        <p className="vads-u-margin-y--0">
          We’ve prefilled some of your information from your account. If you
          need to correct anything, you can edit the form fields below.
        </p>
      </va-alert>
    </>
  ) : (
    <></>
  );
}
