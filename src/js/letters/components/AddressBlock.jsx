import React from 'react';

const AddressBlock = ({ name, children }) => (
  <div>
    <div className="address-block">
      <h5 className="letters-address">{name}</h5>
      {children}
    </div>
    <p>
      A correct address is not required, but keeping it up to date can help you
      on Vets.gov.
    </p>
  </div>
);

export default AddressBlock;
