import React, { useEffect, useState } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { isValidEmail } from 'platform/forms/validations';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const EmailSignup = () => {
  const [inputError, setInputError] = useState(null);
  const [email, setEmail] = useState('');
  const [headerHasFocused, setHeaderHasFocused] = useState(false);

  useEffect(() => {
    const textInput = document?.querySelector('va-text-input');
    const shadowRoot = textInput?.shadowRoot;

    if (shadowRoot) {
      const charCountStyle = document.createElement('style');

      charCountStyle.textContent = `
          #charcount-message {
            color: #565c65;
          }
        `;

      shadowRoot.appendChild(charCountStyle);
    }
  });

  useEffect(
    () => {
      const textInput = document?.querySelector('va-text-input');
      const shadowRoot = textInput?.shadowRoot;

      if (shadowRoot && !headerHasFocused) {
        const inputHeader = shadowRoot?.querySelector('h2');

        if (inputHeader) {
          inputHeader.addEventListener('focus', () => {
            inputHeader.style.outline = 'none';
          });
        }

        if (inputHeader && inputError) {
          inputHeader.setAttribute('tabindex', '-1');
          inputHeader.focus();
          setHeaderHasFocused(true);
        }
      }
    },
    [inputError, headerHasFocused],
  );

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
    <div className="email-signup-form">
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
        <VaTextInput
          autocomplete="email"
          class="homepage-email-input"
          error={inputError || null}
          form-heading="Sign up to get the latest VA updates"
          form-heading-level="2"
          inputmode="email"
          label="Email address"
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
          value={email}
        />
        <va-button
          disable-analytics
          class="vads-u-margin-y--2p5"
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
