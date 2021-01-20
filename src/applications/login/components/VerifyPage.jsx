import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import recordEvent from 'platform/monitoring/record-event';
import {
  authnSettings,
  externalRedirects,
  sessionTypeUrl,
  verify,
} from 'platform/user/authentication/utilities';

function handleClick(version) {
  // For first-time users attempting to navigate to My VA Health, The user must
  // be LOA3. If they aren't, they will get directed to verify here,
  // with a valid redirect URL already in sessionStorage. In that case,
  // preserve the existing redirect and navigate there
  const returnUrl = sessionStorage.getItem(authnSettings.RETURN_URL);

  if (returnUrl && returnUrl.includes(externalRedirects.myvahealth)) {
    recordEvent({ event: 'verify-link-clicked' });
    window.location = sessionTypeUrl('verify', version);
  } else {
    verify(version);
  }
}

export default function VerifyPage() {
  return (
    <div className="row">
      <AlertBox
        content={
          <div>
            <h4 className="usa-alert-heading">
              Please verify your identity before continuing to My VA Health
            </h4>
            <p>
              We take your privacy seriously, and we’re committed to protecting
              your information. You’ll need to verify your identity before we
              can give you access to your personal health information.
            </p>
            <button
              onClick={() => handleClick('v1')}
              className="usa-button-primary va-button-primary"
            >
              Verify your identity
            </button>
          </div>
        }
        isVisible
        status="continue"
      />
    </div>
  );
}
