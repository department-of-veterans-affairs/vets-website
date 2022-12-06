import React from 'react';
import LoginModalButton from 'platform/user/authentication/components/LoginModalButton';

const UnverifiedPrefillAlert = () => (
  <div className="usa-alert usa-alert-info schemaform-sip-alert">
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">
        Save time—and save your work in progress—by signing in before starting
        your order
      </h3>
      <div className="usa-alert-text">
        <p>When you’re signed in to your VA.gov account:</p>
        <ul>
          <li>
            We can prefill part of your order based on your account details.
          </li>
          <li>
            You can save your order in progress, and come back later to finish
            filling it out. You’ll have 60 days from the date you start or
            update your order to submit it. After 60 days, we’ll delete the
            order form and you’ll need to start over.
          </li>
        </ul>
        <p>
          <strong>Note:</strong> If you sign in after you’ve started your
          application, you won’t be able to save the information you’ve already
          filled in.
        </p>
        <LoginModalButton
          className="usa-button-primary"
          message="Sign in to start your order"
          context="cta-form"
        />
      </div>
    </div>
  </div>
);

export default UnverifiedPrefillAlert;
