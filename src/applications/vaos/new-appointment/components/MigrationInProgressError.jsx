import PropTypes from 'prop-types';
import React from 'react';
import NewTabAnchor from '../../components/NewTabAnchor';

export default function MigrationInProgressError({ endDate, facilities }) {
  return (
    <va-alert status="error">
      <h2>
        You can’t schedule at{' '}
        {`${
          facilities.length === 1
            ? facilities[0].facilityName
            : 'some facilities'
        }`}{' '}
        right now
      </h2>
      {facilities.length === 1 && (
        <p>
          Scheduling online is unavailable until {endDate} at{' '}
          {facilities[0].facilityName}
        </p>
      )}
      {facilities.length > 1 && (
        <>
          <p>Scheduling online is unavailable until {endDate} at</p>
          <ul>
            {facilities.map((facility, index) => (
              <li key={index}>{facility.facilityName}</li>
            ))}
          </ul>
        </>
      )}{' '}
      <p>
        <NewTabAnchor href="/find-locations">
          Find a VA health facility
        </NewTabAnchor>
      </p>
    </va-alert>
  );
}
MigrationInProgressError.propTypes = {
  endDate: PropTypes.string,
  facilities: PropTypes.array,
};
