/* eslint-disable react/jsx-key */
import React from 'react';

const getField = (formData, possibilities) =>
  possibilities.reduce((value, field) => {
    if (value === null && formData[field]) {
      return formData[field];
    }
    return value;
  }, null);

const addLine = line =>
  line && (
    <>
      {line}
      <br />
    </>
  );

// Each field is a separate parameter because every form uses a different
// naming system (for now)
const AddressViewField = ({ formData }) => {
  const { country, city, state } = formData;
  const street = getField(formData, ['street', 'addressLine1']);
  const street2 = getField(formData, ['line2', 'street2', 'addressLine2']);
  const street3 = getField(formData, ['line3', 'street3', 'addressLine3']);
  const postalCode = getField(formData, ['postalCode', 'zipCode']);

  let postalString;
  if (postalCode) {
    const lastChunk = postalCode.length > 5 ? `-${postalCode.slice(5)}` : '';
    postalString = `${postalCode.slice(0, 5)}${lastChunk}`;
  }

  const lastLine =
    country === 'USA'
      ? `${city}, ${state} ${postalString}`
      : `${city}, ${country}`;

  return (
    <p>
      {addLine(street)}
      {addLine(street2)}
      {addLine(street3)}
      {lastLine}
    </p>
  );
};

export default AddressViewField;
