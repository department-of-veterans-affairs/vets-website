import React from 'react';

export function StepchildInfo({ formData }) {
  return (
    <div className="vads-u-padding--2">
      <strong>
        {formData.fullName.first} {formData.fullName.last}
      </strong>
      <br />
    </div>
  );
}
