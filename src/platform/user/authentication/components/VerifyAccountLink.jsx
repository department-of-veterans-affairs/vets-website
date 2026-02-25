import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { useIdentityVerificationURL } from '../hooks';
import { SERVICE_PROVIDERS, AUTH_EVENTS } from '../constants';

export default function VerifyAccountLink({
  policy,
  useOAuth = true,
  children,
}) {
  const { href } = useIdentityVerificationURL({ policy, useOAuth });
  return (
    <a
      href={href}
      className={policy}
      data-testid={policy}
      onClick={() =>
        recordEvent({
          event: `${AUTH_EVENTS.VERIFY}-${policy}`,
        })
      }
    >
      {!children && `Create an account with ${SERVICE_PROVIDERS[policy].label}`}
      {children}
    </a>
  );
}

VerifyAccountLink.propTypes = {
  allowVerification: PropTypes.bool,
  children: PropTypes.node,
  policy: PropTypes.string,
  useOAuth: PropTypes.bool,
};
