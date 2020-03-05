import React from 'react';

const AddressViewField = ({ formData }) => {
  const { street, street2, city, country, state, postalCode } = formData;
  let postalString;
  if (postalCode) {
    const firstFive = postalCode.slice(0, 5);
    const lastChunk = postalCode.length > 5 ? `-${postalCode.slice(5)}` : '';
    postalString = `${firstFive}${lastChunk}`;
  }

  let lastLine;
  if (country === 'USA') {
    lastLine = `${city}, ${state} ${postalString}`;
  } else {
    lastLine = `${city}, ${country}`;
  }
  return (
    <p>
      {street && street}
      <br />
      {street2 && street2}
      {street2 && <br />}
      {lastLine}
    </p>
  );
};

export default AddressViewField;
