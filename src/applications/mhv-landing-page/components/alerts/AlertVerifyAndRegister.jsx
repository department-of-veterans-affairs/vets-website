import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  CSP_IDS,
  SERVICE_PROVIDERS,
} from '~/platform/user/authentication/constants';

// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';

import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const AlertVerifyAndRegister = ({ cspId, recordEvent, testId }) => {
  const headline = 'Verify and register your account to access My HealtheVet';
  const serviceProviderLabel = SERVICE_PROVIDERS[cspId].label;

  useEffect(() => {
    recordEvent({
      event: 'nav-alert-box-load',
      action: 'load',
      'alert-box-headline': headline,
      'alert-box-status': 'warning',
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <VaAlert data-testid={testId} status="warning" visible>
      <h2 slot="headline">{headline}</h2>
      <div>
        <p className="vads-u-margin-y--2">
          We need you to verify your identity and register your account before
          you can access My HealtheVet. These steps help us keep your health
          information safe and prevent fraud and identity theft.
        </p>
        <ul>
          <li>
            Verify your identity for your {serviceProviderLabel} account. This
            one-time process often takes about 10 minutes. You’ll need to
            provide certain personal information and identification.
          </li>
          <li>
            Then we’ll ask you to register with My HealtheVet by confirming your
            personal information and relationship with VA health care. You’ll
            need to register before you can access your messages, medications,
            and medical records.
          </li>
        </ul>
        <p>
          <a href="/verify" className="vads-c-action-link--green">
            Verify your identity with {serviceProviderLabel}
          </a>
        </p>
      </div>
    </VaAlert>
  );
};

AlertVerifyAndRegister.defaultProps = {
  cspId: CSP_IDS.LOGIN_GOV,
  recordEvent: recordEventFn,
  testId: 'mhv-alert--verify-and-register',
};

AlertVerifyAndRegister.propTypes = {
  cspId: PropTypes.oneOf([CSP_IDS.ID_ME, CSP_IDS.LOGIN_GOV]),
  recordEvent: PropTypes.func,
  testId: PropTypes.string,
};

export default AlertVerifyAndRegister;
