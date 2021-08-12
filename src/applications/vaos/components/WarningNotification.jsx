import React from 'react';
import InfoAlert from './InfoAlert';
import externalServiceStatus from 'platform/monitoring/DowntimeNotification/config/externalServiceStatus';

export default function WarningNotification({ status }) {
  if (status === externalServiceStatus.down) {
    return (
      <InfoAlert
        className="vads-u-margin-bottom--4"
        headline={`You may have trouble using the VA appointments tool right now.`}
        status="warning"
        level="3"
      >
        <p>
          Some Veterans have reported problems with viewing, scheduling, or
          canceling their appointments. We’re working to fix the issue now.
        </p>
        <p>
          {' '}
          If you have trouble using this tool, call your VA health facility or
          community care provider.{' '}
          <a href="/find-locations">
            Find your health facility or provider’s phone number
          </a>
        </p>
      </InfoAlert>
    );
  }
  return null;
}
