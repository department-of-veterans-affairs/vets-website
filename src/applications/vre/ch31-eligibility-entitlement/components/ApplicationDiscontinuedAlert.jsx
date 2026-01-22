import React from 'react';
import PropTypes from 'prop-types';

const ApplicationDiscontinuedAlert = ({ discontinuedReason }) => {
  return (
    <div className="usa-width-two-thirds vads-u-margin-y--3">
      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
      >
        <h3 slot="headline">
          Sorry, processing your Chapter 31 claim has been discontinued
        </h3>
        <p>
          Your VR&E Chapter 31 claim has been discontinued for the following
          reasons:
        </p>
        <p>{discontinuedReason || 'No reason provided.'}</p>
        <p>
          Please visit your eFolder to view your detailed letter and next steps.
        </p>
        <va-link-action href="https://va.gov" text="eFolder" type="primary" />
      </va-alert>
    </div>
  );
};

ApplicationDiscontinuedAlert.propTypes = {
  discontinuedReason: PropTypes.string,
};

export default ApplicationDiscontinuedAlert;
