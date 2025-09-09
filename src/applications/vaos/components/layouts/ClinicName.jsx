import React from 'react';
import PropTypes from 'prop-types';

export default function ClinicName({ name }) {
  // Clinic name does not exist for Cerner/Oracle Health appointments.
  if (name === undefined) return null;

  return (
    <>
      <br />
      <span>
        Clinic: <span data-dd-privacy="mask">{name || 'Not available'}</span>
      </span>{' '}
    </>
  );
}

ClinicName.propTypes = {
  name: PropTypes.string,
};
