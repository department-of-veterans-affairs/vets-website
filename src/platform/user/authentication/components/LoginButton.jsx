import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import { CSP_CONTENT } from '../constants';

export function loginHandler(loginType) {
  recordEvent({ event: `login-attempted-${loginType}` });
  authUtilities.login({
    policy: loginType,
  });
}

export default function LoginButton({ csp, onClick = loginHandler }) {
  if (!csp) return null;
  return (
    <button
      type="button"
      aria-label={`Sign in with ${CSP_CONTENT[csp].COPY}`}
      className={`usa-button ${csp}-button vads-u-margin-y--1p5 vads-u-padding-y--2`}
      data-csp={csp}
      onClick={() => onClick(csp)}
    >
      {CSP_CONTENT[csp].LOGO}
    </button>
  );
}
