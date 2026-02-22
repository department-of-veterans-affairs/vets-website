import React, { useState } from 'react';
import { apiRequest } from 'platform/utilities/api';
import { login } from 'platform/user/authentication/utilities';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { signInAppCSS } from '../constants';

export default function ProdTestAccess() {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const ial2Enforcement = useToggleValue(
    TOGGLE_NAMES.identityIal2FullEnforcement,
  );

  const isAllowedEmail = user => {
    const pattern = /^[a-zA-Z0-9._%+-]+@(va\.gov|oracle\.com)$/;
    return pattern.test(user);
  };

  const handleEmailChange = e => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setIsValidEmail(isAllowedEmail(emailValue));
  };

  const handleButtonClick = () => {
    apiRequest('/test_account_user_email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    login({
      policy: 'mhv',
      queryParams: { operation: 'myhealthevet_test_account' },
      ial2Enforcement,
    });
  };

  const notDisable = isValidEmail || email.length === 0;

  return (
    <>
      <style>{signInAppCSS}</style>
      <section className="container row login vads-u-padding--3">
        <div className="columns small-12 vads-u-padding--0">
          <h1 id="signin-signup-modal-title">Access production test account</h1>
          <p>
            Production test accounts are available for VA and Oracle Health
            staff only.
          </p>
        </div>
        <h2 className="vads-u-padding-top--4">
          Enter your VA or Oracle Health email
        </h2>
        <va-text-input
          hint={null}
          label="Your email address"
          data-testid="mvhemailinput"
          message-aria-describedby="Your email adress"
          name="Your VA or Oracle Health email"
          value={email}
          required
          onInput={handleEmailChange}
          show-input-error={!notDisable}
          error={
            !notDisable
              ? 'Please enter a valid VA or Oracle Health email'
              : null
          }
        />
        <div className="vads-u-margin-y--2">
          <p>
            <strong>Disclaimer:</strong> By providing your email address you
            agree to only use this
            <br />
            production test account for official VA testing, training, or
            development purposes.
          </p>
        </div>
        <div className="vads-u-margin-y--2">
          <va-button
            onClick={handleButtonClick}
            text="Access test account"
            data-testid="accessMhvBtn"
            disabled={!isValidEmail}
          />
        </div>
        <div className="vads-u-margin-y--6">
          <h2>Having trouble signing in?</h2>
          <p>
            Contact the administrator who gave you access to your test account.
          </p>
        </div>
      </section>
    </>
  );
}
