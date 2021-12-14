import React from 'react';

import recordEvent from 'platform/monitoring/record-event';
import { sessionTypeUrl, verify } from 'platform/user/authentication/utilities';
import {
  AUTHN_SETTINGS,
  EXTERNAL_REDIRECTS,
  AUTH_EVENTS,
  EXTERNAL_APPS,
  API_VERSION,
} from 'platform/user/authentication/constants';

function handleClick(version = API_VERSION) {
  // For first-time users attempting to navigate to My VA Health, The user must
  // be LOA3. If they aren't, they will get directed to verify here,
  // with a valid redirect URL already in sessionStorage. In that case,
  // preserve the existing redirect and navigate there
  const returnUrl = sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL);

  if (
    returnUrl &&
    returnUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.MY_VA_HEALTH])
  ) {
    recordEvent({ event: AUTH_EVENTS.VERIFY });
    window.location = sessionTypeUrl({ type: 'verify', version });
  } else {
    verify(version);
  }
}

export default function VerifyPage() {
  return (
    <div className="row">
      <va-alert visible status="continue">
        <h4 slot="headline" className="usa-alert-heading">
          Please verify your identity before continuing to My VA Health
        </h4>
        <p>
          We take your privacy seriously, and we’re committed to protecting your
          information. You’ll need to verify your identity before we can give
          you access to your personal health information.
        </p>
        <button
          onClick={() => handleClick()}
          className="usa-button-primary va-button-primary"
        >
          Verify your identity
        </button>
      </va-alert>
    </div>
  );
}
