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
