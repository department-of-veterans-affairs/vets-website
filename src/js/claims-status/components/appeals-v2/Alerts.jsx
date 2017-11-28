import React from 'react';
import PropTypes from 'prop-types';
import Alert from './Alert';

const Alerts = (props) => {
  if (typeof props.alerts === 'undefined' || props.alerts.length === 0) {
    return null;
  }

  const alertsList = props.alerts.map((alert, index) => {
    const key = `${alert.type}-${index}`;
    return (<Alert key={key} alert={alert}/>);
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
    details: PropTypes.object
  }))
};

export default Alerts;

