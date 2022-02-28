import React, { useEffect } from 'react';

import Modal from '@department-of-veterans-affairs/component-library/Modal';
import recordEvent from 'platform/monitoring/record-event';
import { MHV_TRANSITION_DATE } from '../../constants';

const AccountTransitionModal = ({ visible, onClose }) => {
  useEffect(
    () => {
      recordEvent({
        event: `login-account-transition-modal-${
          visible ? 'opened' : 'closed'
        }`,
      });
    },
    [visible],
  );

  const primaryButton = {
    action: () => {
      window.location = '/sign-in/transition';
    },
    text: 'Start transition process',
  };

  const secondaryButton = {
    action: onClose,
    text: 'Dismiss for now',
  };

  return (
    <Modal
      visible={visible}
      focusSelector="button"
      onClose={onClose}
      id="account-transition-modal"
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      status="info"
      title="VA.gov is moving to a more secure sign-in process"
    >
      <div className="container">
        <div className="row">
          <div className="columns">
            <p>
              Due to stricter security requirements, your My HealtheVet username
              and password should no longer be used to access your benefits on
              VA.gov. Instead we recommend transitioning to using the{' '}
              <strong>Login.gov</strong> credential.
            </p>

            <p>
              Starting on {MHV_TRANSITION_DATE} a verified{' '}
              <strong>Login.gov</strong> account will be needed to access your
              benefits on VA.gov and My HealtheVet. This is part of a continued
              joint effort to make it safer for you to access and manage the
              benefits you’ve earned.
            </p>

            <p>
              We have made it easy to transition to using a{' '}
              <strong>Login.gov</strong> account. Would you like to transition
              to a Login.gov account right now?
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AccountTransitionModal;
