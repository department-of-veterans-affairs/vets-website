import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

const ApplyButton = ({ event, label, clickEvent }) => (
  // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
  <button
    type="button"
    className="va-button-link schemaform-start-button"
    onClick={() => {
      recordEvent({ event });
      clickEvent();
    }}
  >
    {label}
  </button>
);

ApplyButton.propTypes = {
  clickEvent: PropTypes.func,
  event: PropTypes.string,
  label: PropTypes.string,
};

export default ApplyButton;
