import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import { createOAuthRequest } from 'platform/utilities/oauth';
import { CSP_CONTENT } from '../constants';

export function loginHandler(loginType, useWebSiS) {
  recordEvent({ event: `login-attempted-${loginType}` });
  if (useWebSiS) {
    createOAuthRequest(loginType);
  } else {
    authUtilities.login({ policy: loginType });
  }
}

export default function LoginButton({
  csp,
  onClick = loginHandler,
  useSis = false,
}) {
  if (!csp) return null;
  return (
    <button
      type="button"
      aria-label={`Sign in with ${CSP_CONTENT[csp].COPY}`}
      className={`usa-button ${csp}-button vads-u-margin-y--1p5 vads-u-padding-y--2`}
      data-csp={csp}
      onClick={() => onClick(csp, useSis)}
    >
      {CSP_CONTENT[csp].LOGO}
    </button>
  );
}
