import React from 'react';

import { formatAddress } from 'platform/forms/address/helpers';

export default function AddressView({ data: address }) {
  const { street, cityStateZip, country } = formatAddress(address);

  return (
    <div>
      {street}
      <br />
      {cityStateZip}

      {country && (
        <>
          <br />
          {country}
        </>
      )}
    </div>
  );
}
