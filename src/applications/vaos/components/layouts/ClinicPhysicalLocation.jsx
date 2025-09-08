import React from 'react';
import PropTypes from 'prop-types';

export default function ClinicPhysicalLocation({ location }) {
  // Location does not exist for Cerner/Oracle Health appointments.
  if (location === undefined) return null;

  return (
    <>
      <br />
      <span>
        Location:{' '}
        <span data-dd-privacy="mask">{location || 'Not available'}</span>
      </span>
    </>
  );
}

ClinicPhysicalLocation.propTypes = {
  location: PropTypes.string,
};
