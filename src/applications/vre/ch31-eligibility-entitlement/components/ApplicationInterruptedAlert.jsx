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
          Your VR&E Chapter 31 benefits have been interrupted
        </h3>
        <p>
          Your VR&E Chapter 31 benefits have been interrupted for the following
          reasons:
        </p>
        <p>{interruptedReason || 'No reason provided.'}</p>
        <p>If you need more information, please contact your counselor.</p>
      </va-alert>
    </div>
  );
};

ApplicationInterruptedAlert.propTypes = {
  interruptedReason: PropTypes.string,
  resCaseId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ApplicationInterruptedAlert;
