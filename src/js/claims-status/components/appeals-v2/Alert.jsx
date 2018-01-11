import React from 'react';
import PropTypes from 'prop-types';
import { getAlertContent } from '../../utils/appeals-v2-helpers';

const Alert = ({ alert }) => {
  const { title, description, cssClass } = getAlertContent(alert);
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
  alert: PropTypes.shape({
    type: PropTypes.string.isRequired,
    details: PropTypes.object
  })
};

export default Alert;
