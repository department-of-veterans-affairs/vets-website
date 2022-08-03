import React from 'react';

export default function MailingAddressViewField({ formData }) {
  const {
    country,
    street,
    street2,
    city,
    state,
    postalCode,
  } = formData.address;
  return (
    <>
      {country}
      <br />
      {street} {street2 && `${street2}`}
      <br />
      {city}, {state} {postalCode}
    </>
  );
}
