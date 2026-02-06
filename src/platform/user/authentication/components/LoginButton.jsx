import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import environment from 'platform/utilities/environment';
import { SERVICE_PROVIDERS, OKTA_APPS } from '../constants';
import { createOktaOAuthRequest } from '../../../utilities/oauth/utilities';

export function loginHandler(loginType, isOAuth, oktaParams = {}) {
  const isOAuthAttempt = isOAuth && '-oauth';
  const { codeChallenge = '', clientId = '', state = '' } = oktaParams;
  const isProduction = environment.isProduction() && !environment.isTest();

  if (OKTA_APPS?.includes(clientId)) {
    const url = createOktaOAuthRequest({
      clientId,
      codeChallenge,
      state,
      loginType,
    });
    if (isProduction) {
      recordEvent({
        event: `login-attempted-${loginType}${isOAuthAttempt}`,
      });
    }
    window.location = url;
    // short-circuit the function
    return;
  }

  if (isProduction) {
    recordEvent({ event: `login-attempted-${loginType}${isOAuthAttempt}` });
  }
  authUtilities.login({ policy: loginType });
}

export default function LoginButton({
  csp,
  onClick = loginHandler,
  useOAuth = true,
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
  actionLocation: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  csp: PropTypes.string,
  queryParams: PropTypes.object,
  useOAuth: PropTypes.bool,
  onClick: PropTypes.func,
};
