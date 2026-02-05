import React from 'react';
import PropTypes from 'prop-types';

const ApplicationInterruptedAlert = ({ interruptedReason }) => {
  return (
    <div className="vads-u-margin-y--3">
      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
      >
        <h3 slot="headline">
          Sorry, your VR&E Chapter 31 benefits have been interrupted
        </h3>
        <p>
          Your VR&E Chapter 31 benefits have been interrupted for the following
          reasons:
        </p>
        <p>{interruptedReason || 'No reason provided.'}</p>
        <p>
          Please visit your Electronic Folder (eFolder) to see your detailed
          letter and next steps.
        </p>
        <va-link-action href="https://va.gov" text="eFolder" type="primary" />
      </va-alert>
    </div>
  );
};

ApplicationInterruptedAlert.propTypes = {
  interruptedReason: PropTypes.string,
};

export default ApplicationInterruptedAlert;
