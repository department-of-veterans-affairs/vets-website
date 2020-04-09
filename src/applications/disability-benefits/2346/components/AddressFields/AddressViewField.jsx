import PropTypes from 'prop-types';
import React from 'react';

export const AddressViewField = ({ formData }) => {
  const { street, street2, city, country, state, postalCode } = formData;
  let zipString;
  if (postalCode) {
    const firstFive = postalCode.slice(0, 5);
    const lastChunk = postalCode.length > 5 ? `-${postalCode.slice(5)}` : '';
    zipString = `${firstFive}${lastChunk}`;
  }

  return (
    <p className="blue-bar-block">
      {street && (
        <>
          {street}
          <br />
        </>
      )}
      {street2 && (
        <>
          {street2}
          <br />
        </>
      )}
      {city}
      {','} {state} {zipString}
      <br />
      {country}
    </p>
  );
};

AddressViewField.propTypes = {
  street: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
};

AddressViewField.defaultProps = {
  formData: {},
  street: '',
  street2: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
};
