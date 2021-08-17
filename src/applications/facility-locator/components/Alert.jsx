import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Copied and tweaked from src/applications/claims-status/components/appeals-v2/Alert.jsx.
 * This should probably become a shared component.
 * @param title
 * @param description
 * @param displayType
 * @returns {JSX.Element}
 */
const Alert = ({ title, description, displayType }) => {
  const [isMobile] = useState(window.innerWidth <= 481);

  let cssClass;
  if (displayType === 'warning') {
    cssClass = 'usa-alert-warning';
  } else if (displayType === 'info') {
    cssClass = 'usa-alert-info';
  }

  return (
    <div
      className={`usa-alert ${cssClass} vads-u-margin-top--0 vads-u-margin-bottom--2 ${
        isMobile
          ? 'vads-u-margin-right--3 vads-u-margin-left--2 vads-u-width--auto'
          : ''
      }`}
    >
      <div className="usa-alert-body">
        <h4 className="usa-alert-heading">{title}</h4>
        <div className="usa-alert-text">{description}</div>
      </div>
    </div>
  );
};

Alert.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.element,
  displayType: PropTypes.string.isRequired,
};

export default Alert;
