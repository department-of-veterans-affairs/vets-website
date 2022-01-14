import React from 'react';
import { CSP_CONTENT } from '../constants';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';

function loginHandler(loginType) {
  recordEvent({ event: `login-attempted-${loginType}` });
  authUtilities.login({
    policy: loginType,
  });
}

export default ({ csp }) => (
  <button
    type="button"
    aria-label={`Sign in with ${CSP_CONTENT[csp].COPY}`}
    className={`usa-button ${csp}-button vads-u-margin-y--1p5 vads-u-padding-y--2`}
    data-csp={csp}
    onClick={() => loginHandler(csp)}
  >
    {CSP_CONTENT[csp].LOGO}
  </button>
);
