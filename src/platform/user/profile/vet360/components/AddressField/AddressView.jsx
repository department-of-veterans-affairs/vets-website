import React from 'react';

import { formatAddress } from 'platform/forms/address/helpers';

export default function AddressView({ data: address }) {
  const { addressType } = address;

  const { street, cityStateZip, country } = formatAddress({
    ...address,
    // force formatting of military addresses as domestic
    type: addressType.match(/military/i)
      ? 'DOMESTIC'
      : addressType.toUpperCase(),
  });

  return (
    <div>
      {street}
      <br />
      {cityStateZip}
      <br />
      {country}
    </div>
  );
}
