import React from 'react';
import PropTypes from 'prop-types';

export default function ClinicName({ name }) {
  if (!name) return null;

  return (
    <>
      <br />
      <span data-dd-privacy="mask">{`Clinic: ${name}`}</span>
    </>
  );
}

ClinicName.propTypes = {
  name: PropTypes.string,
};
