import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import { updateStateAndVerifier } from 'platform/utilities/oauth/utilities';
import { CSP_CONTENT, AUTH_EVENTS, LINK_TYPES } from '../constants';

function signupHandler(loginType, eventBase, isOAuth) {
  recordEvent({ event: `${eventBase}-${loginType}${isOAuth && '-oauth'}` });

  if (isOAuth) {
    updateStateAndVerifier(loginType);
  }
}
export default function AccountLink({
  csp,
  type = LINK_TYPES.CREATE,
  useOAuth = false,
}) {
  const [href, setHref] = useState('');

  const { children, eventBase } = {
    children:
      type !== LINK_TYPES.CREATE
        ? `Sign in with ${CSP_CONTENT[csp].COPY} account`
        : `Create an account with ${CSP_CONTENT[csp].COPY}`,
    eventBase:
      type !== LINK_TYPES.CREATE ? AUTH_EVENTS.LOGIN : AUTH_EVENTS.REGISTER,
  };

  useEffect(
    () => {
      async function updateHref(passedCSP, passedType) {
        const url =
          passedType !== LINK_TYPES.CREATE
            ? await authUtilities.sessionTypeUrl({ type: csp })
            : await authUtilities.signupUrl(passedCSP);

        setHref(url);
      }
      updateHref(csp, type);
    },
    [csp, type],
  );

  return (
    <a
      href={href}
      className={`vads-c-action-link--blue vads-u-padding-y--2p5 vads-u-width--full ${csp}`}
      data-testid={csp}
      onClick={() => signupHandler(csp, eventBase, useOAuth)}
    >
      {children}
    </a>
  );
}

AccountLink.propTypes = {
  csp: PropTypes.string,
  isDisabled: PropTypes.bool,
  type: PropTypes.string,
  useOAuth: PropTypes.bool,
};
