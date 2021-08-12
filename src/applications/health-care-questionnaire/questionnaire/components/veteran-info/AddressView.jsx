import React from 'react';

export default function AddressView({ address }) {
  const display = [
    address.addressLine1,
    address.addressLine2,
    address.addressLine3,
  ]
    .filter(f => f)
    .join(' ');
  return (
    <span
      aria-label={`Veterans Address ${display}  ${address.city}, ${
        address.stateCode
      } ${address.zipCode} `}
    >
      <span className="address">{display}</span>
      <br />
      <span className="city-state-zip">
        {address.city}, {address.stateCode} {address.zipCode}
      </span>
    </span>
  );
}
