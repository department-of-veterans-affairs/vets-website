import React from 'react';

export const UnverifiedAlert = (
  <>
    <div className="usa-alert usa-alert-info schemaform-sip-alert">
      <div className="usa-alert-body">
        <h3 className="usa-alert-heading">We couldn’t verify your identity</h3>
        Please try again. If you have a premium DS Logon or My HealtheVet
        account, you can try signing in that way, or you can create an ID.me
        account to complete the verification process.
      </div>
    </div>
    <br />
  </>
);

export const VerifiedAlert = (
  <>
    <div className="usa-alert usa-alert-info schemaform-sip-alert">
      <div className="usa-alert-body">
        <strong>Note:</strong> Since you’re signed in to your account and your
        account is verified, we can prefill part of your application based on
        your account details. You can also save your form in progress for up to
        1 year and come back later to finish filling it out.
      </div>
    </div>
    <br />
  </>
);
