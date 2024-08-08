import React from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  CSP_IDS,
  SERVICE_PROVIDERS,
} from '~/platform/user/authentication/constants';

const VerifyAndRegisterAlert = ({ cspId, testId }) => {
  const serviceProviderLabel = SERVICE_PROVIDERS[cspId]?.label;

  return (
    <VaAlert data-testid={testId} status="warning" visible>
      <h2 slot="headline">
        Verify and register your account to access My HealtheVet
      </h2>
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

VerifyAndRegisterAlert.defaultProps = {
  testId: 'mhv-alert--verify-and-register-idme-logingov-nonloa3',
};

VerifyAndRegisterAlert.propTypes = {
  cspId: PropTypes.oneOf([CSP_IDS.ID_ME, CSP_IDS.LOGIN_GOV]),
  testId: PropTypes.string,
};

export default VerifyAndRegisterAlert;
