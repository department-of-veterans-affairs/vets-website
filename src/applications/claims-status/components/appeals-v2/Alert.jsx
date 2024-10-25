import React from 'react';
import PropTypes from 'prop-types';

const Alert = ({ title, description, displayType }) => {
  let cssClass;
  let iconEl = null;
  if (displayType === 'take_action') {
    cssClass = 'usa-alert-warning';
    iconEl = <va-icon icon="warning" size={4} />;
  } else if (displayType === 'info') {
    cssClass = 'usa-alert-info';
    iconEl = <va-icon icon="info" size={4} />;
  }

  return (
    <li>
      <div className={`usa-alert ${cssClass}`}>
        {iconEl}
        <div className="usa-alert-body">
          <h4 className="usa-alert-heading">{title}</h4>
          <div className="usa-alert-text">{description}</div>
        </div>
      </div>
    </li>
  );
};

Alert.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.element,
  displayType: PropTypes.string.isRequired,
};

export default Alert;
