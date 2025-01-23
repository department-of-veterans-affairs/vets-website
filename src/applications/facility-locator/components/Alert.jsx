import React from 'react';
import PropTypes from 'prop-types';

/**
 * Copied and tweaked from src/applications/claims-status/components/appeals-v2/Alert.jsx.
 * This should probably become a shared component.
 * @param title
 * @param description
 * @param displayType
 * @returns {JSX.Element}
 */
const Alert = ({ title, description, displayType }) => (
  <va-alert
    uswds
    visible
    status={displayType}
    class="vads-u-margin-top--0
    vads-u-margin-bottom--2
    vads-u-margin-right--3
    vads-u-margin-left--2
    vads-u-width--auto
    mobile-lg:vads-u-margin-x--0
    small-screen-header:vads-u-width--full"
  >
    <h2 slot="headline" className="usa-alert-heading">
      {title}
    </h2>
    <div className="usa-alert-text">{description}</div>
  </va-alert>
);

Alert.propTypes = {
  displayType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default Alert;
