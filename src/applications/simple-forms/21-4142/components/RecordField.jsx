import React from 'react';

export default function RecordField({ formData }) {
  const providerFacilityName = formData?.providerFacilityName;
  const { street: providerFacilityStreet } = formData?.providerFacilityAddress;

  return (
    <div>
      <strong>{providerFacilityName ?? providerFacilityStreet}</strong>
    </div>
  );
}
