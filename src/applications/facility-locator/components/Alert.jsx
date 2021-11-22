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
const Alert = ({ title, description, displayType }) => {
  const cssClass = `usa-alert-${displayType}`;

  return (
    <div
      className={`usa-alert ${cssClass}
      vads-u-margin-top--0 
      vads-u-margin-bottom--2   
      vads-u-margin-right--3 
      vads-u-margin-left--2 
      vads-u-width--auto
      small-screen:vads-u-margin-x--0 
      small-screen-header:vads-u-width--full      
      `}
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
  description: PropTypes.string,
  displayType: PropTypes.string.isRequired,
};

export default Alert;
