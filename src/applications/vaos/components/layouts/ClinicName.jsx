import React from 'react';
import PropTypes from 'prop-types';

export default function ClinicName({ name, isCerner = false }) {
  if (isCerner) {
    if (!name) return null;

    return (
      <>
        <br />
        <span data-dd-privacy="mask">{`Clinic: ${name}`}</span>
      </>
    );
  }

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
  isCerner: PropTypes.bool,
  name: PropTypes.string,
};
