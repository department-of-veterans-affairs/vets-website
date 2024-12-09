import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import {
  SERVICE_PROVIDERS,
  CSP_IDS,
} from '@department-of-veterans-affairs/platform-user/authentication/constants';
import { logoutUrl } from '@department-of-veterans-affairs/platform-user/authentication/utilities';
import { logoutUrlSiS } from '~/platform/utilities/oauth/utilities';
import CustomAlert from './CustomAlert';

export const headingPrefix = 'Verify your identity';

/**
 * Alert to show a user that is not verified (LOA1).
 * @property {*} recordEvent the function to record the event
 * @property {string} serviceDescription optional description of the service that requires verification
 * @property {string} signInService the ID of the sign in service
 */
const UnverifiedAlert = ({
  hasSsoe = false,
  recordEvent = recordEventFn,
  serviceDescription,
  signInService = CSP_IDS.ID_ME,
}) => {
  const signinServiceLabel = SERVICE_PROVIDERS[signInService]?.label;
  const headline = serviceDescription
    ? `${headingPrefix} to ${serviceDescription}`
    : headingPrefix;

  /**
   * Directs the user to the sign out page.
   */
  const signOut = () => {
    window.location = hasSsoe ? logoutUrl() : logoutUrlSiS();
  };

  /**
   * The default alert to show a user.
   */
  const DefaultAlert = () => {
    return (
      <div data-testid="mhv-unverified-alert">
        <CustomAlert
          headline={headline}
          icon="lock"
          status="warning"
          recordEvent={recordEvent}
        >
          <div>
            <p>
              We need you to verify your identity for your{' '}
              <strong>{signinServiceLabel}</strong> account. This step helps us
              keep your information safe and prevent fraud and identity theft.
            </p>
            <p>
              This one-time process often takes about 10 minutes. You’ll need to
              provide certain personal information and identification.
            </p>
            <p>
              <a
                className="vads-c-action-link--green"
                href="/resources/verifying-your-identity-on-vagov/"
                hrefLang="en"
              >
                Verify your identity with {signinServiceLabel}
              </a>
            </p>
          </div>
        </CustomAlert>
      </div>
    );
  };

  /**
   * The alert to show a user that is logged in with an MHV account.
   */
  const MhvAlert = () => {
    return (
      <CustomAlert headline={headline} icon="lock" status="warning">
        <div>
          <p>
            To protect your information and prevent fraud and identity theft, we
            need you to sign in with a verified account. You have 2 options: a
            verified <strong>Login.gov</strong> or a verified{' '}
            <strong>ID.me</strong> account.
          </p>
          <p>
            <strong>If you already have a Login.gov or ID.me account,</strong>{' '}
            sign out of VA.gov. Then sign back in using that account. We’ll tell
            you if you need to verify your identity.
          </p>
          <p>
            <strong>If you want to create a Login.gov or ID.me account,</strong>{' '}
            follow these steps:
          </p>
          <p>
            <strong>
              Not sure if you already have a Login.gov or ID.me account?
            </strong>
          </p>
          <ul>
            <li>Sign out of VA.gov</li>
            <li>On the VA.gov homepage, select Create an account</li>
            <li>
              Create a Login.gov or ID.me account. Come back to VA.gov and sign
              in with your Login.gov or ID.me account. We’ll help you verify
              your identity.
            </li>
          </ul>
          <p>
            You may have one if you’ve ever signed in to a federal website to
            manage your benefits—like Social Security or disability benefits. Or
            we may have started creating an <strong>ID.me</strong> account for
            you when you signed in to VA.gov.
          </p>
          <p>
            To check, sign out of VA.gov. Then try to create a new account with
            the email address you think the account is attached to. If you
            already have one, the sign-in service provider will tell you. You
            can then try to reset your password.
          </p>
          <p>
            <va-button
              data-testid="sign-out-button"
              text="Sign out"
              onClick={signOut}
              label="Sign out"
            />
          </p>
          <p>
            <va-link
              href="/resources/creating-an-account-for-vagov/"
              text="Learn about creating an account"
            />
          </p>
        </div>
      </CustomAlert>
    );
  };

  if (signInService === CSP_IDS.MHV) return MhvAlert();

  return DefaultAlert();
};

UnverifiedAlert.propTypes = {
  signInService: PropTypes.string.isRequired,
  hasSsoe: PropTypes.bool,
  recordEvent: PropTypes.func,
  serviceDescription: PropTypes.string,
};

export default UnverifiedAlert;
