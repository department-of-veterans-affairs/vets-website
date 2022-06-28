import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import { updateStateAndVerifier } from 'platform/utilities/oauth/utilities';
import { CSP_CONTENT, AUTH_EVENTS } from '../constants';

function signupHandler(loginType, eventBase, isOAuth) {
  recordEvent({ event: `${eventBase}-${loginType}${isOAuth && '-oauth'}` });

  if (isOAuth) {
    updateStateAndVerifier(loginType);
  }
}

export default function CreateAccountLink({ csp, useOAuth = false }) {
  const [href, setHref] = useState('');

  useEffect(
    () => {
      async function updateHref() {
        const url = await authUtilities.signupUrl(csp);
        setHref(url);
      }
      updateHref();
    },
    [csp],
  );

  return (
    <a
      href={href}
      className={`vads-c-action-link--blue vads-u-padding-y--2p5 vads-u-width--full ${csp}`}
      data-testid={csp}
      onClick={() => signupHandler(csp, AUTH_EVENTS.REGISTER, useOAuth)}
    >
      Create an account with {CSP_CONTENT[csp].COPY}
    </a>
  );
}

export function SignInAccountLink({ csp, useOAuth = false }) {
  const [href, setHref] = useState('');

  useEffect(
    () => {
      async function updateHref() {
        const url = await authUtilities.sessionTypeUrl({ type: csp });
        setHref(url);
      }
      updateHref();
    },
    [csp],
  );

  return (
    <a
      href={href}
      className={`vads-c-action-link--blue vads-u-padding-y--2p5 vads-u-width--full ${csp}`}
      data-testid={csp}
      onClick={() => signupHandler(csp, AUTH_EVENTS.LOGIN, useOAuth)}
    >
      Sign in with {CSP_CONTENT[csp].COPY} account
    </a>
  );
}

CreateAccountLink.propTypes = {
  csp: PropTypes.string.isRequired,
  useOAuth: PropTypes.bool,
};

SignInAccountLink.propTypes = {
  csp: PropTypes.string.isRequired,
  useOAuth: PropTypes.bool,
};
