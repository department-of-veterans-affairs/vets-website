import React from 'react';
import PropTypes from 'prop-types';

export const SaveInProgressWarning = ({ type }) => (
  <va-alert
    status="warning"
    data-testid="ezr-sip-warning"
    class="vads-u-margin-bottom--4"
    uswds
  >
    <p className="vads-u-margin-y--0">
      Be sure to enter all the required information for your {type}. We can only
      save your progress when you enter the required information.
    </p>
  </va-alert>
);

SaveInProgressWarning.propTypes = {
  type: PropTypes.string,
};

export default SaveInProgressWarning;
