import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import { Link } from 'react-router';
import { SERVICE_PROVIDERS } from '../constants';

export function loginHandler(loginType, isOAuth) {
  const isOAuthAttempt = isOAuth && '-oauth';
  recordEvent({ event: `login-attempted-${loginType}${isOAuthAttempt}` });
  authUtilities.login({ policy: loginType });
}

export default function LoginLink({
  csp,
  onClick = loginHandler,
  useOAuth = false,
}) {
  if (!csp) return null;
  return (
    // linter advises to use button instead. However, per designs, action link is required
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link
      aria-label={`Sign in with ${SERVICE_PROVIDERS[csp].label}`}
      className={`vads-c-action-link--blue vads-u-padding-y--2p5 vads-u-width--full ${csp}`}
      data-csp={csp}
      onClick={() => onClick(csp, useOAuth)}
    >
      Sign in with {SERVICE_PROVIDERS[csp].label}
    </Link>
  );
}
