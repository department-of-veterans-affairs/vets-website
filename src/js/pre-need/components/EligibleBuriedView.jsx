import React from 'react';

export default function EligibleBuriedView({ formData }) {
  return (
    <div>
      <div><strong>{formData.name}</strong></div>
      <div>{formData.cemetery}</div>
    </div>
  );
}

