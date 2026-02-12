import React from 'react';

export const PropertyAddress = ({ formData }) => {
  const { city, postalCode, state, street1, street2, street3 } =
    formData?.loanHistory?.relevantPriorLoans?.propertyAddress || {};

  if (!street1 || !city || !state || !postalCode) {
    return null;
  }

  return (
    <p className="va-address-block vads-u-margin-top--6 vads-u-margin-left--0">
      <span className="vads-u-font-weight--bold">Property Address</span>
      <br />
      {street1}
      <br />
      {street2 && (
        <>
          {street2}
          <br />
        </>
      )}
      {street3 && (
        <>
          {street3}
          <br />
        </>
      )}
      {city}, {state} {postalCode} <br />
    </p>
  );
};
