import React from 'react';
import externalServiceStatus from 'platform/monitoring/DowntimeNotification/config/externalServiceStatus';
import PropTypes from 'prop-types';
import InfoAlert from './InfoAlert';

export default function WarningNotification({ status, description }) {
  const splitDescription = description?.split('|');
  const notificationTitle =
    splitDescription?.length > 1 && splitDescription?.[0];
  const descriptionBody = notificationTitle
    ? splitDescription?.[1]
    : splitDescription?.[0];
  if (status === externalServiceStatus.down) {
    return (
      <InfoAlert
        className="vads-u-margin-bottom--4"
        headline={
          notificationTitle ||
          'You may have trouble using the VA appointments tool right now.'
        }
        status="warning"
        level="3"
      >
        {descriptionBody ? (
          <p>{descriptionBody}</p>
        ) : (
          <>
            <p>
              Some Veterans have reported problems with viewing, scheduling, or
              canceling their appointments. We’re working to fix the issue now.
            </p>
            <p>
              {' '}
              If you have trouble using this tool, call your VA health facility
              or community care provider.{' '}
              <a href="/find-locations">
                Find your health facility or provider’s phone number
              </a>
            </p>
          </>
        )}
      </InfoAlert>
    );
  }
  return null;
}
WarningNotification.propTypes = {
  description: PropTypes.string,
  status: PropTypes.string,
};
