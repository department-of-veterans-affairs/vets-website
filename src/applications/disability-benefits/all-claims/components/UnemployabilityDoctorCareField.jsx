import React from 'react';

export default function RecentJobApplicationField({ formData }) {
  const { name, address } = formData;

  return (
    <p className="dd-privacy-mask">
      <strong>{name}</strong>
      <br />
      {address.city && address.state && `${address.city}, ${address.state}`}
      {address.city &&
        address?.country !== 'USA' &&
        `${address.city}, ${address.country}`}
    </p>
  );
}
