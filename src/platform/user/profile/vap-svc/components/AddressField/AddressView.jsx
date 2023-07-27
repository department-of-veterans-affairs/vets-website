import React from 'react';

import { formatAddress } from 'platform/forms/address/helpers';

export default function AddressView({ data: address }) {
  const { street, cityStateZip, country } = formatAddress(address);

  return (
    <>
      <div className="dd-privacy-hidden">{street}</div>
      <div className="dd-privacy-hidden">{cityStateZip}</div>
      {country && <div className="dd-privacy-hidden">{country}</div>}
    </>
  );
}
