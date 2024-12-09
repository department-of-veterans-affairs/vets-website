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
  const headline = 'Verify your identity';
  const serviceProviderLabel = SERVICE_PROVIDERS[cspId].label;
  const verifyIdentityUrl = {
    [CSP_IDS.LOGIN_GOV]:
      '/resources/how-to-verify-your-identity-for-your-logingov-account/',
    [CSP_IDS.ID_ME]:
      '/resources/how-to-verify-your-identity-for-your-idme-account/',
  };
  const learnHowToVerifyIdentityUrl = verifyIdentityUrl[cspId];

  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': 'warning',
      });
    },
    [headline, recordEvent],
  );

  return (
    <VaAlert data-testid={testId} status="warning" visible>
      <h2 slot="headline">{headline}</h2>
      <div>
        <p className="vads-u-margin-y--2">
          We need you to verify your identity for your
          <strong> {serviceProviderLabel}</strong> account. This step helps us
          protect all Veterans’ information and prevent scammers from stealing
          your benefits.
        </p>
        <p>
          This one-time process often takes about 10 minutes. You’ll need to
          provide certain personal information and identification.
        </p>
        <p>
          <a href="/verify" className="vads-c-action-link--green">
            Verify your identity with {serviceProviderLabel}
          </a>
        </p>
        <p>
          <a href={learnHowToVerifyIdentityUrl}>
            Learn more about verifying your identity
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
