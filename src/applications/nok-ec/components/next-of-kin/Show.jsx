import React from 'react';

const Show = props => {
  const {
    givenName,
    familyName,
    relationship,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    state,
    zipCode,
    primaryPhone,
    // handleSubmit,
  } = props;

  return (
    <>
      <div>
        <h3>Name</h3>
        {givenName} {familyName}
      </div>

      <div>
        <h3>Relationship</h3>
        {relationship}
      </div>

      <div>
        <h3>Address</h3>
        {addressLine1}
        <br />
        {addressLine2}
        <br />
        {addressLine3}
        <br />
        {city}, {state} {zipCode}
      </div>

      <div>
        <h3>Phone</h3>
        {primaryPhone}
      </div>

      {/* <va-button text="Edit" onClick={handleSubmit} /> */}
    </>
  );
};

export default Show;
