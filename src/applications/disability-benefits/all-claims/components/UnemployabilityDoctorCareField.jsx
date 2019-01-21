import React from 'react';

export default function RecentJobApplicationField({ formData }) {
  const { name, address } = formData;

  return (
    <div>
      <strong>{name}</strong>
      <p>
        {address.city && address.state && `${address.city}, ${address.state}`}
      </p>
    </div>
  );
}
