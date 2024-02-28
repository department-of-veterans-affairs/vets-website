import React from 'react';
import { COOKIES, CLIENT_IDS } from 'platform/utilities/oauth/constants';
import IdentityPhone from 'platform/user/authentication/components/IdentityPhone';
import { touStyles } from '../constants';

export default function Declined() {
  const shouldRedirectToMobile =
    sessionStorage.getItem(COOKIES.CI) === CLIENT_IDS.VAMOBILE;
  const navigateBackToMobile = () => {
    sessionStorage.removeItem(COOKIES.CI);
    window.location = `vamobile://login-terms-rejected`;
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      {shouldRedirectToMobile && <style>{touStyles}</style>}
      <div className="usa-content">
        <h1>We’ve signed you out</h1>
        <p>
          You declined the VA online services terms of use, so we've signed you
          out.
        </p>
        <h2>What you can do</h2>
        <p>
          You can still get VA health care and benefits without using our online
          services. If you need help or have questions, <IdentityPhone /> We’re
          here 24/7.
        </p>
        <p>
          Or you can change your answer and accept the terms. If you want to
          accept the terms, follow these steps:
        </p>
        <ol>
          <li>Quit your browser.</li>
          <li>Reopen your browser.</li>
          <li>
            Go to VA.gov and sign in again. We’ll take you back to the terms of
            use.
          </li>
          <li>
            Select "<strong>Accept</strong>" to continue using VA online
            services.
          </li>
        </ol>
        <p className="vads-u-margin-y--3">
          <va-link
            href="https://va.gov/terms-of-use/"
            text="Review the terms of use"
          />
        </p>
        {shouldRedirectToMobile && (
          <va-button text="Sign in" onClick={navigateBackToMobile} />
        )}
      </div>
    </div>
  );
}
