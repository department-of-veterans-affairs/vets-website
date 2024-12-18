import React, { useState } from 'react';
import LoginButton from 'platform/user/authentication/components/LoginButton';

export default function MhvSignIn() {
  const [email, setEmail] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const isAllowedEmail = user => {
    const pattern = /^[a-zA-Z0-9._%+-]+@(va\.gov|myhealth\.com)$/;
    return pattern.test(user);
  };

  const handleEmailChange = e => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setIsValidEmail(isAllowedEmail(emailValue));
  };

  const handleCheckboxChange = e => {
    setCheckboxChecked(e.target.checked);
  };

  return (
    <section className="container login">
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
        value={email}
        required
        onInput={handleEmailChange}
        show-input-error={!isValidEmail}
        error={
          isValidEmail ? null : 'Please enter a valid VA or Oracle Health email'
        }
      />
      <va-checkbox
        label="I’m using My HealtheVet for official VA testing, training, or development purposes."
        message-aria-describedby="I’m using My HealtheVet for official VA testing, training, or development purposes."
        enable-analytics
        checked={checkboxChecked}
        onChange={handleCheckboxChange}
      />
      <LoginButton csp="mhv" key="mhv" useOAuth={false} disabled />
      <h2>Having trouble signing in?</h2>
      <p>Contact the administrator who gave you access to your test account.</p>
    </section>
  );
}
