import React from 'react';
import externalServiceStatus from '../config/externalServiceStatus';
import DowntimeNotificationWrapper from './Wrapper';

export function DownMessaging({ endTime, appTitle }) {
  if (endTime) {
    return (
      <p>
        We’re making some updates to the {appTitle}. We’re sorry it’s not
        working right now, and we hope to be finished by{' '}
        {endTime.format('MMMM Do, LT')} Please check back soon.
      </p>
    );
  }
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
