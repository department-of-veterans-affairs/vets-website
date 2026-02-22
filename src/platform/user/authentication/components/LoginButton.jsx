import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import environment from 'platform/utilities/environment';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { SERVICE_PROVIDERS, OKTA_APPS } from '../constants';
import { createOktaOAuthRequest } from '../../../utilities/oauth/utilities';

export function loginHandler(
  loginType,
  isOAuth,
  oktaParams = {},
  ial2Enforcement = false,
) {
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
  authUtilities.login({ policy: loginType, ial2Enforcement });
}

export default function LoginButton({
  csp,
  onClick = loginHandler,
  useOAuth = true,
  ariaDescribedBy,
  actionLocation,
  queryParams = {},
}) {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const ial2Enforcement = useToggleValue(
    TOGGLE_NAMES.identityIal2FullEnforcement,
  );
  if (!csp) return null;
  const actionName = `${csp}-signin-button-${actionLocation}`;
  return (
    <button
      type="button"
      data-dd-action-name={actionName}
      className={`usa-button ${csp}-button vads-u-margin-y--1p5 vads-u-padding-y--2`}
      data-csp={csp}
      onClick={() => onClick(csp, useOAuth, queryParams, ial2Enforcement)}
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
