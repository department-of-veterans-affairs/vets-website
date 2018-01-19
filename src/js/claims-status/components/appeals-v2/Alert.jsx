import React from 'react';
import PropTypes from 'prop-types';

const Alert = ({ title, description, cssClass }) => {
  return (
    <li>
      <div className={`usa-alert ${cssClass}`}>
        <div className="usa-alert-body">
          <h4 className="usa-alert-heading">{title}</h4>
          <p className="usa-alert-text">{description}</p>
        </div>
      </div>
    </li>
  );
};

Alert.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.object.isRequired, // nullable JSX snippet
  cssClass: PropTypes.object.isRequired,
};

export default Alert;
