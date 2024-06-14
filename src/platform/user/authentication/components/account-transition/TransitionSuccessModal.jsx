import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import recordEvent from 'platform/monitoring/record-event';
import { useSelector } from 'react-redux';
import { signInServiceName } from 'platform/user/authentication/selectors';
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
    <Modal
      visible={visible}
      focusSelector="button"
      onClose={onClose}
      id="account-transition-success-modal"
      primaryButton={primaryButton}
      status="success"
      title="Account transfer is complete"
    >
      {/* React Modal Component used in Injected Header DO NOT MIGRATE to Modal web component */}
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
    </Modal>
  );
}

TransitionSuccessModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};
