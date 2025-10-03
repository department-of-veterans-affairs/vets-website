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
          <div className="vads-u-margin-y--1">
            <va-button
              aria-label="Confirm Contact Email"
              className="vads-u-margin-bottom--1 confirm-button"
              text="Confirm"
              fullwidth
              onClick={handleConfirmation}
            />
          </div>
          <div>
            <va-button
              continue
              aria-label="Update Contact Email"
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
