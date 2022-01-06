import React from 'react';
import { CSP_CONTENT } from '../constants';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';

function signupHandler(loginType) {
  recordEvent({ event: `register-link-clicked-${loginType}` });
}

export default ({ csp, isDisabled }) => (
  <a
    href={authUtilities.signupUrl(csp)}
    className={`vads-c-action-link--blue ${csp}`}
    disabled={isDisabled}
    onClick={() => signupHandler(csp)}
  >
    Create an account with {CSP_CONTENT[csp].COPY}
  </a>
);
