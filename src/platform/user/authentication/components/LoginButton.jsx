import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import PropTypes from 'prop-types';
import { SERVICE_PROVIDERS } from '../constants';
import { sessionTypeUrl } from '../utilities';

export function loginHandler(loginType, isOAuth, queryParams) {
  const isOAuthAttempt = isOAuth && '-oauth';
  recordEvent({ event: `login-attempted-${loginType}${isOAuthAttempt}` });
  authUtilities.login({ policy: loginType });
  if (queryParams.clientId === 'okta_test') {
    sessionTypeUrl({
      type: 'okta_test',
      useOauth: false,
      queryParams,
    });
  }
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
