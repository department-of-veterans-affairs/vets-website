import React from 'react';
import externalServiceStatus from '../config/externalServiceStatus';
import DowntimeNotificationWrapper from './Wrapper';

// eslint-disable-next-line no-unused-vars
export function DownMessaging({ endTime, appTitle }) {
  return (
    <p>
      We’re making some updates to the {appTitle}. We’re sorry it’s not working
      right now. Please check back soon.
    </p>
  );
}

export default function Down({ endTime, appTitle }) {
  return (
    <DowntimeNotificationWrapper status={externalServiceStatus.down}>
      <div className="usa-content">
        <h3>The {appTitle} is down for maintenance</h3>
        <DownMessaging endTime={endTime} appTitle={appTitle} />
      </div>
    </DowntimeNotificationWrapper>
  );
}
