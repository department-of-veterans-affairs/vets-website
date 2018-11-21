import React from 'react';

export default function AuthorityField({ formData }) {
  const { name } = formData;
  const {
    street,
    street2,
    city,
    state,
    postalCode,
    country,
  } = formData.address;

  return (
    <div>
      <strong>{name}</strong>
      <br />
      <strong>
        {street} {street2}
      </strong>
      <br />
      <strong>
        {city} {state} {postalCode}
      </strong>
      <br />
      <strong>{country}</strong>
    </div>
  );
}
