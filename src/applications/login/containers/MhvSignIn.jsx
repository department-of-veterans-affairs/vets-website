import React from 'react';
import LoginButton from 'platform/user/authentication/components/LoginButton';

export default function MhvSignIn() {
  return (
    <section className="login">
      <div className="columns small-12">
        <h1 id="signin-signup-modal-title">My HealtheVet test account</h1>
        <p>
          My HealtheVet test accounts are available for VA and Oracle Health
          staff only.
        </p>
      </div>
      <h2>Enter your VA or Oracle Health email</h2>
      <va-text-input
        hint={null}
        label="Your VA email"
        message-aria-describedby="Your VA email"
        name="Your VA or Oracle Health email"
        onBlur={function noRefCheck() {}}
        onInput={function noRefCheck() {}}
        show-input-error
      />
      <va-checkbox
        required
        label="I’m using My HealtheVet for official VA testing, training, or development purposes."
        message-aria-describedby="I’m using My HealtheVet for official VA testing, training, or development purposes."
        enable-analytics
      />
      <LoginButton csp="mhv" key="mhv" useOAuth={false} />
      <h2>Having trouble signing in?</h2>
      <p>Contact the administrator who gave you access to your test account.</p>
    </section>
  );
}
