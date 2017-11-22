import React from 'react';
import PropTypes from 'prop-types';

const Alerts = ({ alerts }) => {
  const alertsList = alerts.map((alert, index) => {
    const { type, date, details } = alert;
    const key = `${type}-${index}`;
    return (
      <div key={key} className="usa-alert usa-alert-warning">
        <div className="usa-alert-body">
          <h3 className="usa-alert-heading">{details.title}</h3>
          <p className="usa-alert-text">{date} - {details.description}</p>
        </div>
      </div>
    );
  });

  return (
    <div>

    </div>
  );
};

Alerts.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    details: PropTypes.string
  })).isRequired
};

export default Alerts;

