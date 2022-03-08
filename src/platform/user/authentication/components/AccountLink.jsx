import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import { CSP_CONTENT, AUTH_EVENTS } from '../constants';

function signupHandler(loginType, eventBase) {
  recordEvent({ event: `${eventBase}-${loginType}` });
}

export default function AccountLink({ csp, isDisabled, type = 'create' }) {
  const { href, children, eventBase } = {
    href:
      type !== 'create'
        ? authUtilities.sessionTypeUrl({ type: csp })
        : authUtilities.signupUrl(csp),
    children:
      type !== 'create'
        ? `Sign in with ${CSP_CONTENT[csp].COPY} account`
        : `Create an account with ${CSP_CONTENT[csp].COPY}`,
    eventBase: type !== 'create' ? AUTH_EVENTS.LOGIN : AUTH_EVENTS.REGISTER,
  };

  return (
    <a
      href={href}
      className={`vads-c-action-link--blue vads-u-padding-y--2p5 vads-u-width--full ${csp}`}
      disabled={isDisabled}
      onClick={() => signupHandler(csp, eventBase)}
    >
      {children}
    </a>
  );
}

AccountLink.propTypes = {
  csp: PropTypes.string,
  isDisabled: PropTypes.bool,
  type: PropTypes.string,
};
