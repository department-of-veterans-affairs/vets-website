import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { useIdentityVerificationURL } from '../hooks';
import { SERVICE_PROVIDERS, AUTH_EVENTS } from '../constants';

export default function VerifyAccountLink({
  policy,
  useOAuth = true,
  children,
}) {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const ial2Enforcement = useToggleValue(
    TOGGLE_NAMES.identityIal2FullEnforcement,
  );
  const { href } = useIdentityVerificationURL({
    policy,
    useOAuth,
    ial2Enforcement,
  });
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
