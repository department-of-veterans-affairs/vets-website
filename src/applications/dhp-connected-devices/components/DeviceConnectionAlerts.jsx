import React from 'react';
import PropTypes from 'prop-types';

export const DeviceConnectionAlert = ({
  testId,
  status,
  headline,
  description,
}) => {
  return (
    <div data-testid={testId}>
      <va-alert
        close-btn-aria-label="Close notification"
        status={status}
        visible
        uswds
      >
        <h3 slot="headline">{headline}</h3>
        <div>{description}</div>
      </va-alert>
    </div>
  );
};

DeviceConnectionAlert.propTypes = {
  description: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};
