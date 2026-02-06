import PropTypes from 'prop-types';
import React from 'react';
import NewTabAnchor from '../../components/NewTabAnchor';

export default function MigrationWarning({
  facilities,
  migrationDate,
  endDate,
}) {
  const trigger = `Updates will begin on ${migrationDate}`;
  return (
    <va-alert-expandable status="warning" trigger={trigger}>
      {facilities.length === 1 && (
        <p>
          From {migrationDate}, to {endDate}, you won’t be able to schedule
          appointments online at {facilities[0].facilityName}
        </p>
      )}
      {facilities.length > 1 && (
        <>
          <p>
            From {migrationDate}, to {endDate}, you won’t be able to schedule
            appointments online at
          </p>
          <ul>
            {facilities.map((facility, index) => (
              <li key={index}>{facility.facilityName}</li>
            ))}
          </ul>
        </>
      )}
      <NewTabAnchor href="/find-locations">
        Find a VA health facility
      </NewTabAnchor>
    </va-alert-expandable>
  );
}
MigrationWarning.propTypes = {
  endDate: PropTypes.string,
  facilities: PropTypes.array,
  migrationDate: PropTypes.string,
};
