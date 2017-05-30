import React from 'react';

export default function FullNameField({ formData }) {
  return (
    <div>
      <strong>{formData.first} {formData.middle} {formData.last}{formData.suffix && `, ${formData.suffix}`}</strong>
    </div>
  );
}
