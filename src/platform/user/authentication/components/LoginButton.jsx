import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import { SERVICE_PROVIDERS } from '../constants';

export function loginHandler(loginType, isOAuth) {
  const isOAuthAttempt = isOAuth && '-oauth';
  recordEvent({ event: `login-attempted-${loginType}${isOAuthAttempt}` });
  authUtilities.login({ policy: loginType });
}

export default function LoginButton({
  csp,
  onClick = loginHandler,
  useOAuth = false,
  ariaDescribedBy,
  ddActionLocation,
}) {
  if (!csp) return null;
  const actionName = `${csp}-signin-button-${ddActionLocation}`;
  return (
    <button
      type="button"
      className={`usa-button ${csp}-button vads-u-margin-y--1p5 vads-u-padding-y--2`}
      data-csp={csp}
      onClick={() => onClick(csp, useOAuth)}
      aria-describedby={ariaDescribedBy}
      data-dd-action-name={actionName}
    >
      {SERVICE_PROVIDERS[csp].image}
    </button>
  );
}
