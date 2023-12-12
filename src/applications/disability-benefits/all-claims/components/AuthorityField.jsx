import PropTypes from 'prop-types';
import React from 'react';

export default function AuthorityField({ formData }) {
  const { name, phone } = formData;
  const {
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
  } = formData.address;

  return (
    <div>
      <strong>{name}</strong>
      <br />
      {addressLine1} {addressLine2}
      <br />
      {city} {state} {postalCode}
      <br />
      {country}
      <br />
      {phone}
    </div>
  );
}

AuthorityField.propTypes = {
  formData: PropTypes.shape({
    address: PropTypes.shape({
      addressLine1: PropTypes.string,
      addressLine2: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      postalCode: PropTypes.string,
      country: PropTypes.string,
    }),
    name: PropTypes.string,
    phone: PropTypes.string,
  }),
};
