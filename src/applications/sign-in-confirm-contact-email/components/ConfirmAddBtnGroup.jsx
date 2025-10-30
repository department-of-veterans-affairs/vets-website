import React from 'react';

export default function ConfirmAddBtnGroup({ email, handleConfirmation }) {
  return (
    <>
      {email === 'No email provided' ? (
        <div className="vads-u-margin-y--2">
          <va-link-action
            href="https://va.gov/profile/contact-information"
            text="Add email in profile"
            type="primary-entry"
          />
        </div>
      ) : (
        <div className="vads-u-display--flex vads-u-margin-y--2 vads-u-flex-direction--column">
          <div className="vads-u-margin-top--1 vads-u-margin-bottom--2">
            <va-button
              full-width
              aria-label="Confirm Contact Email"
              class="confirm-button"
              text="Confirm"
              onClick={handleConfirmation}
            />
          </div>
          <div>
            <va-button
              continue
              full-width
              aria-label="Update Contact Email"
              class="update-button"
              text="Update email in profile"
              secondary
              onClick={() => {
                window.location.href =
                  'https://www.va.gov/profile/contact-information';
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
