import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import { updateStateAndVerifier } from 'platform/utilities/oauth/utilities';
import { SERVICE_PROVIDERS, AUTH_EVENTS } from '../constants';

function signupHandler(loginType, isOAuth = false) {
  recordEvent({
    event: `${AUTH_EVENTS.REGISTER}-${loginType}${isOAuth ? '-oauth' : ''}`,
  });

  if (isOAuth) {
    updateStateAndVerifier(loginType);
  }
}

export default function CreateAccountLink({
  policy,
  useOAuth = false,
  children,
  externalApplication,
}) {
  const [href, setHref] = useState('');

  useEffect(
    () => {
      async function generateURL() {
        const url = await authUtilities.signupOrVerify({
          policy,
          isLink: true,
          allowVerification: false,
          useOAuth,
          config: externalApplication,
        });
        setHref(url);
      }
      generateURL();
    },
    [policy, useOAuth, externalApplication],
  );

  return (
    <a
      href={href}
      className={`vads-c-action-link--blue vads-u-padding-y--2p5 vads-u-width--full ${policy}`}
      data-testid={policy}
      onClick={() => signupHandler(policy, useOAuth)}
    >
      {!children && `Create an account with ${SERVICE_PROVIDERS[policy].label}`}
      {children}
    </a>
  );
}

CreateAccountLink.propTypes = {
  children: PropTypes.node,
  externalApplication: PropTypes.string,
  policy: PropTypes.string,
  useOAuth: PropTypes.bool,
};
