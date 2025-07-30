import React from 'react';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import PropTypes from 'prop-types';

const DowntimeWindowAlert = ({ children, appTitle }) => {
  return (
    <DowntimeNotification
      appTitle={appTitle}
      dependencies={[externalServices.travelPay, externalServices.vaos]}
    >
      {children || <></>}
    </DowntimeNotification>
  );
};
DowntimeWindowAlert.propTypes = {
  appTitle: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default DowntimeWindowAlert;
