import React, { useEffect } from 'react';

import Modal from '@department-of-veterans-affairs/component-library/Modal';
import recordEvent from 'platform/monitoring/record-event';
import { MHV_TRANSITION_DATE, MHV_TRANSITION_TIME } from '../../constants';

const AccountTransitionModal = ({
  visible,
  onClose,
  canTransferMHVAccount,
}) => {
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
      window.location = '/transfer-account';
    },
    text: canTransferMHVAccount
      ? 'Start to transfer my account'
      : 'Learn how to transfer account',
  };

  const secondaryButton = {
    action: onClose,
    text: 'Remind me later',
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
      title="Prepare for sign in changes at VA"
    >
      {/* React Modal Component used in Injected Header DO NOT MIGRATE to Modal web component */}
      <div className="container">
        <div className="row">
          <div className="columns">
            <p>
              {MHV_TRANSITION_DATE ? (
                <>
                  Starting on <strong>{MHV_TRANSITION_DATE}</strong>,{' '}
                </>
              ) : (
                <>Soon </>
              )}
              you’ll no longer be able to use your My HealtheVet username and
              password to sign in. You’ll need to use a verified{' '}
              <strong>Login.gov</strong> or <strong>ID.me</strong> account that
              meets our new, stronger security requirements. With{' '}
              <strong>Login.gov</strong> or <strong>ID.me</strong>, you’ll still
              have access to all the same information and services you use
              today.
            </p>
            {canTransferMHVAccount ? (
              <p>
                We can help you transfer your account to{' '}
                <strong>Login.gov</strong> now. This process should take about
                {MHV_TRANSITION_TIME} minutes. You’ll need access to your email
                account and your phone to transfer your account.
              </p>
            ) : (
              <p>
                We can help you transfer to a verified account today. We’ll
                answer your questions about the different account types and help
                you get started to create a new account.
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AccountTransitionModal;
