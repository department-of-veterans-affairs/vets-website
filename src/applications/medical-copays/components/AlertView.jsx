import React from 'react';
import Alert from '../components/Alerts';

const AlertView = ({ pathname, alertType, error }) => {
  const overview = 'Your current copay balances';
  const details = 'Copay bill details';

  return (
    <>
      <h1>{pathname === '/' ? overview : details}</h1>
      <Alert type={alertType} error={error} />
    </>
  );
};

export default AlertView;
