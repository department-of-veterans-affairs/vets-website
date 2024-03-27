import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { useSelector } from 'react-redux';
import { signInServiceName } from 'platform/user/authentication/selectors';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { SERVICE_PROVIDERS } from '../../constants';

export default function TransitionSuccessModal({ visible, onClose }) {
  const signInService = useSelector(signInServiceName);
  const TRANSFERED_CSP = SERVICE_PROVIDERS[signInService];
  const primaryButton = {
    action: () => {
      recordEvent({ event: `login-account-transition-success-modal-dismiss` });
      onClose();
    },
    text: 'Continue to VA.gov',
  };

  useEffect(
    () => {
      recordEvent({
        event: `login-account-transition-success-modal-${
          visible ? 'opened' : 'closed'
        }`,
      });
    },
    [visible],
  );

  return (
    <VaModal
      visible={visible}
      initialFocusSelector="button"
      onCloseEvent={onClose}
      id="account-transition-success-modal"
      onPrimaryButtonClick={primaryButton}
      status="success"
      title="Account transfer is complete"
    >
      <div className="container">
        <div className="row">
          <p>
            You have sucessfully transferred your My HealtheVet account to{' '}
            <strong>{TRANSFERED_CSP}</strong>. Your credentials and information
            are now associated with this new account. You have access to all of
            the same benefits and services you would normally use on My
            HealtheVet and VA.gov.
          </p>
          <p>
            As you continue to use VA services, please ensure that you use this
            account to sign in.
          </p>
        </div>
      </div>
    </VaModal>
  );
}

TransitionSuccessModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};
