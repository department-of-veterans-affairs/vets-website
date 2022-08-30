import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import * as authUtilities from 'platform/user/authentication/utilities';
import { updateStateAndVerifier } from 'platform/utilities/oauth/utilities';
import { SERVICE_PROVIDERS, AUTH_EVENTS, LINK_TYPES } from '../constants';

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
  className = 'vads-c-action-link--blue vads-u-padding-y--2p5 vads-u-width--full',
  allowVerification = false,
}) {
  const [href, setHref] = useState('');

  const { children, eventBase } = {
    children:
      type !== LINK_TYPES.CREATE
        ? `Sign in with ${SERVICE_PROVIDERS[csp].label} account`
        : `Create an account with ${SERVICE_PROVIDERS[csp].label}`,
    eventBase:
      type !== LINK_TYPES.CREATE ? AUTH_EVENTS.LOGIN : AUTH_EVENTS.REGISTER,
  };

  useEffect(
    () => {
      async function updateHref(passedCSP, passedType) {
        const url =
          passedType !== LINK_TYPES.CREATE
            ? await authUtilities.sessionTypeUrl({ type: csp })
            : await authUtilities.signup({
                policy: passedCSP,
                isLink: true,
                allowVerification,
              });

        setHref(url);
      }
      updateHref(csp, type);
    },
    [csp, type, useOAuth, allowVerification],
  );

  return (
    <a
      href={href}
      className={`${className} ${csp}`}
      data-testid={csp}
      onClick={() => signupHandler(csp, eventBase, useOAuth)}
    >
      {children}
    </a>
  );
}

AccountLink.propTypes = {
  className: PropTypes.string,
  csp: PropTypes.string,
  isDisabled: PropTypes.bool,
  type: PropTypes.string,
  useOAuth: PropTypes.bool,
};
