import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import VerifyAlert from '~/platform/user/authorization/components/VerifyAlert';
import {
  CSP_IDS,
  SERVICE_PROVIDERS,
} from '~/platform/user/authentication/constants';

const AlertNotVerified = ({ cspId, recordEvent }) => {
  const serviceLabel = SERVICE_PROVIDERS[cspId].label;
  const headline = `Verify your identity to use your ${serviceLabel} account on My HealtheVet`;

  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': 'continue',
      });
    },
    [headline, recordEvent],
  );

  return (
    <VerifyAlert headingLevel={2} dataTestId="verify-identity-alert-headline" />
  );
};

AlertNotVerified.defaultProps = {
  cspId: CSP_IDS.DS_LOGON,
  recordEvent: recordEventFn,
};

AlertNotVerified.propTypes = {
  cspId: PropTypes.oneOf(Object.keys(SERVICE_PROVIDERS)),
  recordEvent: PropTypes.func,
};

export default AlertNotVerified;
