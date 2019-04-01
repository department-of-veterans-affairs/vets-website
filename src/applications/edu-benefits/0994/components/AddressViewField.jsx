import React from 'react';

export const AddressViewField = ({ formData }) => {
  const { street, street2, street3, city, state, postalCode } = formData;
  let postalString;
  if (postalCode) {
    const firstFive = postalCode.slice(0, 5);
    const lastChunk = postalCode.length > 5 ? `-${postalCode.slice(5)}` : '';
    postalString = `${firstFive}${lastChunk}`;
  }

  return (
    <p className="blue-bar-block">
      {street && street}
      {street && <br />}
      {street2 && street2}
      {street2 && <br />}
      {street3 && street3}
      {street3 && <br />}
      {city && city} {state && state} {postalString && postalString}
    </p>
  );
};
