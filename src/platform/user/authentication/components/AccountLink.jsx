import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import { CSP_CONTENT, AUTH_EVENTS, LINK_TYPES } from '../constants';

function signupHandler(loginType, eventBase) {
  recordEvent({ event: `${eventBase}-${loginType}` });
}

export default function AccountLink({ csp, type = LINK_TYPES.CREATE }) {
  if (!csp) return null;
  const { href, children, eventBase } = {
    href:
      type !== LINK_TYPES.CREATE
        ? authUtilities.sessionTypeUrl({ type: csp })
        : authUtilities.signupUrl(csp),
    children:
      type !== LINK_TYPES.CREATE
        ? `Sign in with ${CSP_CONTENT[csp].COPY} account`
        : `Create an account with ${CSP_CONTENT[csp].COPY}`,
    eventBase:
      type !== LINK_TYPES.CREATE ? AUTH_EVENTS.LOGIN : AUTH_EVENTS.REGISTER,
  };

  return (
    <a
      href={href}
      className={`vads-c-action-link--blue vads-u-padding-y--2p5 vads-u-width--full ${csp}`}
      data-csp={csp}
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
