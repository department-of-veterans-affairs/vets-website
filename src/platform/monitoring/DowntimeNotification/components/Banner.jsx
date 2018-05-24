import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import DowntimeNotification, { serviceStatus } from '../index';
import { DownMessaging } from './Down';

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
