import React from 'react';

import { verify } from 'platform/user/authentication/utilities';

export default function VerifyPage() {
  return (
    <section className="login">
      <div className="container">
        <div className="row">
          <va-alert visible status="continue">
            <h4 slot="headline" className="usa-alert-heading">
              Please verify your identity before continuing to My VA Health
            </h4>
            <p>
              We take your privacy seriously, and we’re committed to protecting
              your information. You’ll need to verify your identity before we
              can give you access to your personal health information.
            </p>
            <button
              onClick={verify}
              type="button"
              className="usa-button-primary va-button-primary"
            >
              Verify your identity
            </button>
          </va-alert>
        </div>
      </div>
    </section>
  );
}
