import React, { useState } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { isValidEmail } from 'platform/forms/validations';

const EmailSignup = () => {
  const [inputError, setInputError] = useState(null);
  const [email, setEmail] = useState(null);

  const setInputErrorState = () => {
    if (!email || !email?.length || !isValidEmail(email)) {
      setInputError(
        `Enter a valid email address without spaces using this format: email@domain.com`,
      );
    } else {
      setInputError(null);
    }
  };

  const onInput = event => {
    setEmail(event.target.value);

    if (inputError) {
      setInputErrorState();
    }
  };

  const onSignup = () => {
    setInputErrorState();

    if (email?.length && isValidEmail(email)) {
      recordEvent({
        event: 'homepage-email-sign-up',
        'button-click-label': 'Sign up',
      });

      const form = document.querySelector('#email-signup-form');

      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div className="email-signup-form form-panel">
      <form
        acceptCharset="UTF-8"
        action="https://public.govdelivery.com/accounts/USVACHOOSE/subscribers/qualify"
        id="email-signup-form"
        method="POST"
      >
        <input type="hidden" name="utf8" value="✓" />
        <input
          type="hidden"
          name="category_id"
          id="category_id_top"
          value="USVACHOOSE_C1"
        />
        <input
          type="hidden"
          name="email"
          id="homepage-hidden-email"
          value={email}
        />
        <va-text-input
          autocomplete="email"
          charcount
          class="homepage-email-input"
          error={inputError || null}
          form-heading="Sign up to get the latest VA updates"
          form-heading-level="2"
          inputmode="email"
          label="Email address"
          maxlength={130}
          onBlur={setInputErrorState}
          onInput={onInput}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              onSignup();
            }
          }}
          required
          type="email"
          use-forms-pattern="single"
        />
        <va-button
          class="vads-u-width--auto vads-u-margin-bottom--2 vads-u-margin-top--1p5"
          onClick={event => {
            event.preventDefault();
            onSignup();
          }}
          text="Sign up"
        />
      </form>
    </div>
  );
};

export default EmailSignup;
