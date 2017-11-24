import React from 'react';
import PropTypes from 'prop-types';
import { getAlertContent } from '../../utils/appeals-v2-helpers';

const Alerts = (props) => {
  const alertsList = props.alerts.map((alert, index) => {
    const key = `${alert.type}-${index}`;
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
  });

  return (
    <ul className="alerts-list">
      {alertsList}
    </ul>
  );
};

Alerts.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    date: PropTypes.string,
    details: PropTypes.string
  })).isRequired
};

export default Alerts;

