import React from 'react';
import PropTypes from 'prop-types';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

export const ProfileAlertConfirmEmailContent = ({
  emailAddress,
  onConfirmClick,
  onEditClick,
  isLoading = false,
}) => (
  <React.Fragment key=".1">
    <p>
      We’ll send notifications about your VA health care and benefits to this
      email.
    </p>
    <p className="vads-u-font-weight--bold" style={{ wordBreak: 'break-word' }}>
      {emailAddress}
    </p>
    <div className="vads-u-display--flex vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row">
      <LoadingButton
        onClick={onConfirmClick}
        isLoading={isLoading}
        loadingText="Confirming email"
      >
        Confirm
      </LoadingButton>
      {!isLoading && (
        <va-button
          secondary
          text="Edit contact email"
          onClick={onEditClick}
          class="vads-u-margin-top--1p5 mobile-lg:vads-u-margin-top--0 mobile-lg:vads-u-margin-left--1"
        />
      )}
    </div>
  </React.Fragment>
);

ProfileAlertConfirmEmailContent.propTypes = {
  emailAddress: PropTypes.string.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
