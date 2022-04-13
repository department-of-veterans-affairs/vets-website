import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import recordEvent from 'platform/monitoring/record-event';

export default function TransitionSucessModal({ visible, onClose }) {
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
      title="You're using a Login.gov account"
    >
      <div className="container">
        <div className="row">
          <p>
            Congratulations! You have sucessfully signed in with your newly
            created <strong>Login.gov</strong> account. This account will give
            you acess to the same benefits and services you would normally use
            on VA.gov or My HealtheVet.
          </p>
          <p>
            It is recommended that you continue to use this account as your
            preferred credential.
          </p>
        </div>
      </div>
    </Modal>
  );
}

TransitionSucessModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};
