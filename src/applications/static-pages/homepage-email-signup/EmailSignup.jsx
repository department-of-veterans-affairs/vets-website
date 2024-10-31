import React, { useState } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { isValidEmail } from 'platform/forms/validations';
import './email-signup.scss';

const GOV_DELIVERY_URL =
  'https://public.govdelivery.com/accounts/USVACHOOSE/subscribers/qualify';

const EmailSignup = () => {
  const [serviceError, setServiceError] = useState(false);
  const [inputError, setInputError] = useState(null);
  const [email, setEmail] = useState(null);

  const logEvents = () => {
    recordEvent({
      event: 'cta-button-click',
      'button-type': 'primary',
      'button-click-label': 'Sign up',
    });

    recordEvent({
      event: 'homepage-email-sign-up',
      action: 'Homepage email sign up',
    });
  };

  const setInputErrorMessage = () => {
    if (!email || !email?.length) {
      setInputError(
        `Enter a valid email address without spaces using this format: email@domain.com`,
      );
    } else if (!isValidEmail(email)) {
      setInputError(
        `You entered a character we can’t accept. Try removing spaces and any special characters like commas or brackets.`,
      );
    } else {
      setInputError(null);
    }
  };

  const onSignup = async () => {
    if (!email || !isValidEmail(email)) {
      setInputErrorMessage();
      return;
    }

    logEvents();

    fetch(GOV_DELIVERY_URL, {
      method: 'POST',
      body: {
        email,
        utf8: '✓',
        // eslint-disable-next-line camelcase
        category_id: 'USVACHOOSE_C1',
      },
    })
      .then(response => {
        if (response.ok) {
          window.location = GOV_DELIVERY_URL;
        }
      })
      .catch(() => {
        setServiceError(true);
      });
  };

  return (
    <>
      {serviceError && (
        <va-banner type="error" headline={`We've run into a problem`}>
          <p className="vads-u-margin--0">
            Something went wrong on our end. Try again later.
          </p>
        </va-banner>
      )}
      <div className="homepage-email-update-wrapper vads-u-background-color--primary-alt-lightest vads-u-padding-x--2p5 vads-u-padding-top--2p5">
        <div className="vads-u-display--flex vads-u-justify-content--center">
          <form
            acceptCharset="UTF-8"
            className="medium-screen:vads-u-margin-top--2p5 medium-screen:vads-u-margin-top--0"
          >
            <va-text-input
              autocomplete="email"
              charcount
              class="vads-u-width--full medium-screen:vads-u-width-auto homepage-email-input"
              error={inputError || null}
              form-heading="Sign up to get the latest VA updates"
              form-heading-level="2"
              inputmode="email"
              label="Email Address"
              maxlength={130}
              onBlur={setInputErrorMessage}
              onInput={e => setEmail(e.target.value)}
              required
              type="email"
              use-forms-pattern="single"
            />
            <va-button
              disable-analytics
              onClick={onSignup}
              class="vads-u-margin-bottom--2 vads-u-margin-top--1p5"
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
    </>
  );
};

export default EmailSignup;
