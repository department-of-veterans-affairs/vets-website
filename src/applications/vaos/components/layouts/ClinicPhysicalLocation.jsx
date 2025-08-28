import React from 'react';
import PropTypes from 'prop-types';

export default function ClinicPhysicalLocation({ location }) {
  if (!location) return null;

  return (
    <>
      <br />
      <span>
        Location: <span data-dd-privacy="mask">{location}</span>
      </span>
    </>
  );
}

ClinicPhysicalLocation.propTypes = {
  location: PropTypes.string,
};
