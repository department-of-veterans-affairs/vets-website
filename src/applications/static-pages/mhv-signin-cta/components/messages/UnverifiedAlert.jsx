import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import {
  SERVICE_PROVIDERS,
  CSP_IDS,
} from '@department-of-veterans-affairs/platform-user/authentication/constants';
import {
  VerifyButton,
  VerifyIdmeButton,
  VerifyLogingovButton,
} from '~/platform/user/authentication/components/VerifyButton';
import CustomAlert from './CustomAlert';

export const headingPrefix = 'Verify your identity';

/**
 * Alert to show a user that is not verified (LOA1).
 * @property {*} recordEvent the function to record the event
 * @property {string} serviceDescription optional description of the service that requires verification
 * @property {string} signInService the ID of the sign in service
 */
const UnverifiedAlert = ({
  recordEvent = recordEventFn,
  serviceDescription,
  signInService = CSP_IDS.ID_ME,
}) => {
  const signinServiceLabel = SERVICE_PROVIDERS[signInService]?.label;
  const headline = serviceDescription
    ? `${headingPrefix} to ${serviceDescription}`
    : headingPrefix;
  const verifyServiceButton =
    signInService === CSP_IDS.LOGIN_GOV ? (
      <VerifyLogingovButton />
    ) : (
      <VerifyIdmeButton />
    );

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
              protect all Veterans’ information and prevent scammers from
              stealing your benefits.
            </p>
            <p>
              This one-time process often takes about 10 minutes. You’ll need to
              provide certain personal information and identification.
            </p>
            <p>{verifyServiceButton}</p>
            <p>
              <va-link
                href="/resources/verifying-your-identity-on-vagov/"
                text="Learn more about verifying your identity"
              />
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
            We need you to sign in with an identity-verified account. This helps
            us protect all Veterans’ information and prevent scammers from
            stealing your benefits. You have 2 options: a verified{' '}
            <strong>Login.gov</strong> or a verified <strong>ID.me</strong>{' '}
            account.
          </p>
          <p>
            <strong>If you already have a Login.gov or ID.me account,</strong>{' '}
            sign in with that account. If you still need to verify your identity
            for your account, we’ll help you do that now.
          </p>
          <p>
            <strong>If you don’t have a Login.gov or ID.me account,</strong>{' '}
            create one now. We’ll help you verify your identity.
          </p>
          <p>
            <VerifyButton csp={CSP_IDS.LOGIN_GOV} />
          </p>
          <p>
            <VerifyButton csp={CSP_IDS.ID_ME} />
          </p>
          <va-link
            href="/resources/creating-an-account-for-vagov/"
            text="Learn about creating an account"
          />
        </div>
      </CustomAlert>
    );
  };

  if (signInService === CSP_IDS.MHV) return MhvAlert();

  return DefaultAlert();
};

UnverifiedAlert.propTypes = {
  signInService: PropTypes.string.isRequired,
  recordEvent: PropTypes.func,
  serviceDescription: PropTypes.string,
};

export default UnverifiedAlert;
