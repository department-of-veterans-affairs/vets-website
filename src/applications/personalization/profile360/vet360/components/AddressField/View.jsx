import React from 'react';

import { formatAddress } from '../../../../../../platform/forms/address/helpers';

export default function AddressView({ data: address }) {
  const { street, cityStateZip, country } = formatAddress({
    addressOne: address.addressLine1,
    addressTwo: address.addressLine2,
    addressThree: address.addressLine3,
    // force formatting of military addresses as domestic
    type: address.addressType.match(/military/i)
      ? 'DOMESTIC'
      : address.addressType.toUpperCase(),
    ...address,
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
