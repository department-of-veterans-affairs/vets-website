import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import { verify } from 'platform/user/authentication/utilities';
import recordEvent from 'platform/monitoring/record-event';

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
              onClick={() => {
                recordEvent({ event: 'verify-link-clicked' });
                verify('v1');
              }}
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
