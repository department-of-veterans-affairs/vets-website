import React from 'react';
import PropTypes from 'prop-types';

import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from '~/platform/user/authentication/components/VerifyButton';
import CallToActionAlert from '../../CallToActionAlert';

/**
 * Alert to show a user that has mhv basic account (is not verified).
 * @property {string} headerLevel optional heading level
 * @property {string} serviceDescription optional description of the service that requires verification
 */
const SignInOtherAccount = ({ headerLevel, serviceDescription }) => {
  const headingPrefix = 'You need to sign in with a different account';
  const headline = serviceDescription
    ? `${headingPrefix} to ${serviceDescription}`
    : headingPrefix;

  const content = {
    heading: headline,
    headerLevel,
    alertText: (
      <>
        <p>
          We need you to sign in with an identity-verified account. This helps
          us protect all Veterans' information and prevent scammers from
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
          <VerifyLogingovButton />
        </p>
        <p>
          <VerifyIdmeButton />
        </p>
        <p>
          <va-link
            href="/resources/creating-an-account-for-vagov/"
            text="Learn about creating an account"
            disableAnalytics
          />
        </p>
      </>
    ),
    status: 'warning',
  };

  return <CallToActionAlert {...content} />;
};

SignInOtherAccount.propTypes = {
  headerLevel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  serviceDescription: PropTypes.string,
};

export default SignInOtherAccount;
