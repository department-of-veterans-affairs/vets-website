import PropTypes from 'prop-types';
import React from 'react';
import NewTabAnchor from '../../components/NewTabAnchor';

export default function MigrationWarning({ facilities, startDate, endDate }) {
  const trigger = `Updates will begin on ${startDate}`;
  return (
    <va-alert-expandable status="warning" trigger={trigger}>
      {facilities.length === 1 && (
        <p>
          From {startDate}, to {endDate}, you won’t be able to schedule
          appointments online at{' '}
          {facilities[0].name || facilities[0].facilityName}
        </p>
      )}
      {facilities.length > 1 && (
        <>
          <p>
            From {startDate}, to {endDate}, you won’t be able to schedule
            appointments online at:
          </p>
          <ul>
            {facilities.map((facility, index) => (
              <li key={index}>{facility.name || facility.facilityName}</li>
            ))}
          </ul>
        </>
      )}
      <p className="vads-u-margin--0">
        <strong>NOTE: </strong>
        During this time, you can still call{' '}
        {facilities.length === 1 ? 'this facility' : 'these facilities'} to
        schedule your appointment.{' '}
      </p>
      <NewTabAnchor href="/find-locations">
        Find a VA health facility
      </NewTabAnchor>
    </va-alert-expandable>
  );
}
MigrationWarning.propTypes = {
  endDate: PropTypes.string,
  facilities: PropTypes.array,
  startDate: PropTypes.string,
};
