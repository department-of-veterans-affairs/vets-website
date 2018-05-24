import React from 'react';
import PropTypes from 'prop-types';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import DowntimeNotification, { serviceStatus } from '../index';
import { DownMessaging } from './Down';

/**
 * A banner component for simple downtime messaging
 * @param {object} props appTitle, dependencies, children
 * @module platorm/monitoring/DowntimeNotification/Banner
 */
export default function DowntimeBanner({ appTitle, dependencies, children }) {
  return (
    <DowntimeNotification
      appTitle={appTitle}
      render={(downtime) => {
        if (downtime.status === serviceStatus.down) {
          return (
            <AlertBox
              status="info"
              isVisible
              content={children || <DownMessaging appTitle={appTitle} {...downtime}/>}/>
          );
        }
        return <div/>;
      }}
      loadingIndicator={<div/>}
      dependencies={dependencies}/>
  );
}

DowntimeBanner.propTypes = {
  appTitle: PropTypes.string,
  dependencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node
};
