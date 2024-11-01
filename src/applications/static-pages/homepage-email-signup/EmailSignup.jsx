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

  const validEmail = () => {
    return email?.length && isValidEmail(email);
  };

  const onSignupClick = e => {
    e.preventDefault();
    setInputErrorState();

    if (!inputError && validEmail()) {
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
    <div className="homepage-email-update-wrapper vads-u-background-color--primary-alt-lightest vads-u-padding-x--2p5 vads-u-padding-top--2p5">
      <div className="vads-u-display--flex vads-u-justify-content--center">
        <form
          acceptCharset="UTF-8"
          action="https://public.govdelivery.com/accounts/USVACHOOSE/subscribers/qualify"
          id="email-signup-form"
          method="POST"
          onSubmit={validEmail}
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
            class="vads-u-width--full medium-screen:vads-u-width-auto homepage-email-input"
            error={inputError || null}
            form-heading="Sign up to get the latest VA updates"
            form-heading-level="2"
            inputmode="email"
            label="Email address"
            maxlength={130}
            onBlur={setInputErrorState}
            onInput={e => setEmail(e.target.value)}
            required
            type="email"
            use-forms-pattern="single"
          />
          <va-button
            class="vads-u-width--auto vads-u-margin-bottom--2 vads-u-margin-top--1p5"
            onClick={onSignupClick}
            text="Sign up"
          />
        </form>
      </div>
      <div className="vads-u-display--none medium-screen:vads-u-display--block">
        <div className="veteran-banner-container vads-u-margin-y--0 vads-u-margin-x--auto">
          <picture>
            <source
              srcSet="/img/homepage/veterans-banner-mobile-1.png 640w, /img/homepage/veterans-banner-mobile-2.png 920w, /img/homepage/veterans-banner-mobile-3.png 1316w"
              media="(max-width: 767px)"
            />
            <source
              srcSet="/img/homepage/veterans-banner-tablet-1.png 1008w, /img/homepage/veterans-banner-tablet-2.png 1887w"
              media="(max-width: 1008px)"
            />
            <img
              className="vads-u-width--full"
              src="/img/homepage/veterans-banner-desktop-1.png"
              srcSet="/img/homepage/veterans-banner-desktop-1.png 1280w, /img/homepage/veterans-banner-desktop-2.png 2494w"
              loading="lazy"
              alt="Veteran portraits"
            />
          </picture>
        </div>
      </div>
    </div>
  );
};

export default EmailSignup;
