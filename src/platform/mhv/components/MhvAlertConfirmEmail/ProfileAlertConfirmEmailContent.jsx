import React from 'react';
import PropTypes from 'prop-types';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

export const ProfileAlertConfirmEmailContent = ({
  emailAddress,
  isConfirming = false,
  onConfirmClick,
  onEditClick,
}) => (
  <React.Fragment key=".1">
    <p>
      We’ll send notifications about your VA health care and benefits to this
      email.
    </p>
    <p
      className="vads-u-font-weight--bold vads-u-margin-bottom--0p25"
      style={{ wordBreak: 'break-word' }}
    >
      {emailAddress}
    </p>
    <div className="vads-u-display--block mobile-lg:vads-u-display--flex">
      <LoadingButton
        id="alert-confirm-email-button"
        onClick={onConfirmClick}
        isLoading={isConfirming}
        loadingText="Confirming email"
      >
        Confirm
      </LoadingButton>
      {!isConfirming && (
        <va-button
          secondary
          text="Edit contact email"
          onClick={onEditClick}
          class="vads-u-width--full mobile-lg:vads-u-width--auto vads-u-margin-top--1 vads-u-margin-bottom--1 hydrated"
        />
      )}
    </div>
  </React.Fragment>
);

ProfileAlertConfirmEmailContent.propTypes = {
  emailAddress: PropTypes.string.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  isConfirming: PropTypes.bool,
};
