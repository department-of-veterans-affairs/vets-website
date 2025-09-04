import React from 'react';
import PropTypes from 'prop-types';

export default function ClinicPhysicalLocation({ location, isCerner }) {
  if (isCerner) {
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
  isCerner: PropTypes.bool,
  location: PropTypes.string,
};
