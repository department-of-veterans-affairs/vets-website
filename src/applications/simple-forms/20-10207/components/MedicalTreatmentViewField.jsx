import React from 'react';

export function MedicalTreatmentViewField({ formData }) {
  return (
    <div className="vads-u-padding--2">
      <strong>{formData.facilityName}</strong>
      <br />
    </div>
  );
}
