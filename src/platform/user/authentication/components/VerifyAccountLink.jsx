import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import { SERVICE_PROVIDERS, AUTH_EVENTS } from '../constants';

export default function VerifyAccountLink({
  policy,
  useOAuth = false,
  children,
}) {
  const [href, setHref] = useState('');
  useEffect(() => {
    async function generateURL() {
      const url = await authUtilities.signupOrVerify({
        policy,
        allowVerification: true,
        isSignup: false,
        isLink: true,
        useOAuth,
      });
      setHref(url);
    }

    generateURL();
  }, []);

  return (
    <a
      href={href}
      className={policy}
      data-testid={policy}
      onClick={() => {
        const eventMessage = `${AUTH_EVENTS.VERIFY}-${policy}`;
        Sentry.withScope(scope => {
          scope.setTag('policy', policy);
          scope.setTag('isOAuth', useOAuth);
          Sentry.captureMessage(eventMessage);
        });
        recordEvent({
          event: eventMessage,
        });
      }}
    >
      {!children && `Create an account with ${SERVICE_PROVIDERS[policy].label}`}
      {children}
    </a>
  );
}

VerifyAccountLink.propTypes = {
  allowVerification: PropTypes.bool,
  children: PropTypes.node,
  policy: PropTypes.string,
  useOAuth: PropTypes.bool,
};
