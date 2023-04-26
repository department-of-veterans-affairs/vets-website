import React from 'react';

export default function RecordField({ formData }) {
  return (
    <div>
      <strong>{formData.providerFacilityName}</strong>
    </div>
  );
}
