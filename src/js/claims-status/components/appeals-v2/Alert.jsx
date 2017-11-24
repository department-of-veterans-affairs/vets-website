import React from 'react';
import PropTypes from 'prop-types';
import { getAlertContent } from '../../utils/appeals-v2-helpers';

const Alert = ({ alert, key }) => {
  const { title, description, cssClass } = getAlertContent(alert);
  return (
    <li key={key}>
      <div className={`usa-alert ${cssClass}`}>
        <div className="usa-alert-body">
          <h3 className="usa-alert-heading">{title}</h3>
          <p className="usa-alert-text">{description}</p>
        </div>
      </div>
    </li>
  );
};

Alert.propTypes = {
  key: PropTypes.string.isRequired,
  alert: PropTypes.shape({
    type: PropTypes.string.isRequired,
    date: PropTypes.string,
    details: PropTypes.string
  })
};

export default Alert;
