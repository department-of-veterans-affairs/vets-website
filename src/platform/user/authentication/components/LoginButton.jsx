import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import { SERVICE_PROVIDERS, TEST_APPS } from '../constants';
import { createOktaOAuthRequest } from '../../../utilities/oauth/utilities';

export function loginHandler(loginType, isOAuth, oktaParams = {}) {
  const isOAuthAttempt = isOAuth && '-oauth';
  const { codeChallenge = '', clientId = '', acr = '' } = oktaParams;

  if (clientId === TEST_APPS.OKTA && !environment.isProduction()) {
    const url = createOktaOAuthRequest({
      clientId,
      codeChallenge,
      loginType,
      acr,
    });
    recordEvent({
      event: `login-attempted-${loginType}${isOAuthAttempt}__okta_test`,
    });
    window.location = url;
    // short-circuit the function
    return;
  }

  recordEvent({ event: `login-attempted-${loginType}${isOAuthAttempt}` });
  authUtilities.login({ policy: loginType });
}

export default function LoginButton({
  csp,
  onClick = loginHandler,
  useOAuth = false,
  ariaDescribedBy,
  actionLocation,
  queryParams = {},
}) {
  if (!csp) return null;
  const actionName = `${csp}-signin-button-${actionLocation}`;
  return (
    <button
      type="button"
      data-dd-action-name={actionName}
      className={`usa-button ${csp}-button vads-u-margin-y--1p5 vads-u-padding-y--2`}
      data-csp={csp}
      onClick={() => onClick(csp, useOAuth, queryParams)}
      aria-describedby={ariaDescribedBy}
    >
      {SERVICE_PROVIDERS[csp].image}
    </button>
  );
}

LoginButton.propTypes = {
  csp: PropTypes.string,
  onClick: PropTypes.func,
  useOAuth: PropTypes.bool,
  ariaDescribedBy: PropTypes.string,
  actionLocation: PropTypes.string,
  queryParams: PropTypes.object,
};
