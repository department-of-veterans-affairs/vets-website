import PropTypes from 'prop-types';
import React from 'react';
import NewTabAnchor from '../../components/NewTabAnchor';

export default function MigrationInProgressError({
  endDate,
  facilities,
  isMixedRegistration = false,
}) {
  return (
    <va-alert status={isMixedRegistration ? 'warning' : 'error'}>
      <h2>
        You can’t schedule at{' '}
        {`${
          facilities.length === 1
            ? facilities[0].name || facilities[0].facilityName
            : 'some facilities'
        }`}{' '}
        right now
      </h2>
      {facilities.length === 1 && (
        <p>
          Scheduling online is unavailable until {endDate} at{' '}
          {facilities[0].name || facilities[0].facilityName}
        </p>
      )}
      {facilities.length > 1 && (
        <>
          <p>Scheduling online is unavailable until {endDate} at:</p>
          <ul>
            {facilities.map((facility, index) => (
              <li key={index}>{facility.name || facility.facilityName}</li>
            ))}
          </ul>
        </>
      )}
      <p className="vads-u-margin--0">You'll need to call to schedule.</p>
      <NewTabAnchor href="/find-locations">
        Find a VA health facility
      </NewTabAnchor>
    </va-alert>
  );
}
MigrationInProgressError.propTypes = {
  endDate: PropTypes.string,
  facilities: PropTypes.array,
  isMixedRegistration: PropTypes.bool,
};
