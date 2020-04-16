import PropTypes from 'prop-types';
import React from 'react';

const getField = (formData, possibilities) =>
  possibilities.reduce((value, field) => {
    if (value === null && formData[field]) {
      return formData[field];
    }
    return value;
  }, null);

const addLine = line => line && [line, <br key={line} />];

const AddressViewField = ({ formData }) => {
  // unchanged address variable names
  const { country, city, state } = formData;

  // this should cover all current address use cases
  // street, line2, line3, postalCode = platform address schema
  // addressLine1, addressLine2, addressLine3 = 526 & HLR
  // zipCode = multiple forms
  const street = getField(formData, ['street', 'addressLine1']);
  const street2 = getField(formData, ['line2', 'street2', 'addressLine2']);
  const street3 = getField(formData, ['line3', 'street3', 'addressLine3']);
  const postalCode = getField(formData, ['postalCode', 'zipCode']);

  let postalString = '';
  if (postalCode) {
    const lastChunk = postalCode.length > 5 ? `-${postalCode.slice(5)}` : '';
    postalString = `${postalCode.slice(0, 5)}${lastChunk}`;
  }

  return (
    <div className="vads-u-border-left--7px vads-u-border-color--primary">
      <p className="vads-u-margin-left--2 vads-u-margin-top--0">
        {addLine(street)}
        {addLine(street2)}
        {addLine(street3)}
        {country === 'USA'
          ? `${city}, ${state} ${postalString}`
          : `${city}, ${country}`}
      </p>
    </div>
  );
};

AddressViewField.propTypes = {
  formData: PropTypes.shape({
    country: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string,

    street: PropTypes.string,
    street2: PropTypes.string,
    street3: PropTypes.string,

    addressLine1: PropTypes.string,
    addressLine2: PropTypes.string,
    addressLine3: PropTypes.string,

    postalCode: PropTypes.string,
    zipCode: PropTypes.string,
  }),
};

export default AddressViewField;
