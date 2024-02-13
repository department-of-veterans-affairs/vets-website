import React from 'react';
import * as Sentry from '@sentry/browser';
import { SENTRY_TAGS } from 'platform/user/authentication/errors';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import { SERVICE_PROVIDERS } from '../constants';

export function loginHandler(loginType, isOAuth) {
  const isOAuthAttempt = isOAuth && '-oauth';
  const eventMessage = `login-attempted-${loginType}${isOAuthAttempt}`;
  Sentry.withScope(scope => {
    scope.setTag(SENTRY_TAGS.LOGIN_TYPE, loginType);
    scope.setTag('isOAuth', isOAuth);
    Sentry.captureMessage(eventMessage);
  });
  recordEvent({ event: eventMessage });
  authUtilities.login({ policy: loginType });
}

export default function LoginButton({
  csp,
  onClick = loginHandler,
  useOAuth = false,
}) {
  if (!csp) return null;
  return (
    <button
      type="button"
      aria-label={`Sign in with ${SERVICE_PROVIDERS[csp].label}`}
      className={`usa-button ${csp}-button vads-u-margin-y--1p5 vads-u-padding-y--2`}
      data-csp={csp}
      onClick={() => onClick(csp, useOAuth)}
    >
      {SERVICE_PROVIDERS[csp].image}
    </button>
  );
}
