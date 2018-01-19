import React from 'react';
import PropTypes from 'prop-types';
import Alert from './Alert';

const Alerts = ({alerts}) => {
  if (typeof alerts === 'undefined' || alerts.length === 0) {
    return null;
  }

  const takeActionAlerts = alerts.filter((alert) => (alert.details.type === 'take_action'));
  const infoAlert = alerts.filter((alert) => (alert.details.type === 'info'));

  const alertsList = takeActionAlerts
    .concat(infoAlert)
    .map((alert, index) => {
      const key = `${alert.type}-${index}`;
      return (<Alert key={key} alert={alert}/>);
    });
  
  const takeActionHeader = (takeActionAlerts.length)
    ? (<h3>Take Action</h3>)
    : null;

  return (
    <div>
      {takeActionHeader}
      <ul className="alerts-list">
        {alertsList}
      </ul>
    </div>
  );

//   const alertsList = alerts.map((alert, index) => {
//     const key = `${alert.type}-${index}`;
//     return (<Alert key={key} alert={alert}/>);
//   });

//   return (
//     <ul className="alerts-list">
//       {alertsList}
//     </ul>
//   );
// };

// Alerts.propTypes = {
//   alerts: PropTypes.arrayOf(PropTypes.shape({
//     type: PropTypes.string.isRequired,
//     details: PropTypes.object
//   }))
};

export default Alerts;
