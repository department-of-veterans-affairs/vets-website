import React from 'react';
import PropTypes from 'prop-types';

export default function ConfirmAddBtnGroup({
  email,
  handleConfirmation,
  isConfirming = false,
}) {
  return (
    <>
      {email === 'No email provided' ? (
        <div className="vads-u-margin-y--2">
          <va-link-action
            href="/profile/contact-information"
            text="Add email in profile"
            type="primary-entry"
          />
        </div>
      ) : (
        <div className="vads-u-display--flex vads-u-margin-y--2 vads-u-flex-direction--column">
          <div className="vads-u-margin-top--1 vads-u-margin-bottom--2">
            <va-button
              data-testid="sign-in--confirm-email-button"
              full-width
              aria-label="Confirm Contact Email"
              class="confirm-button"
              text={isConfirming ? 'Confirming' : 'Confirm'}
              loading={isConfirming}
              onClick={() => handleConfirmation()}
            />
          </div>
          {!isConfirming && (
            <div>
              <va-button
                continue
                full-width
                aria-label="Update Contact Email"
                class="update-button"
                text="Update email in profile"
                secondary
                onClick={() => {
                  window.location.pathname = '/profile/contact-information';
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

ConfirmAddBtnGroup.propTypes = {
  email: PropTypes.string.isRequired,
  handleConfirmation: PropTypes.func.isRequired,
  isConfirming: PropTypes.bool,
};
