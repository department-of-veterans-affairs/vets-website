import React from 'react';

export default function SpouseMarriageView({ formData }) {
  const { first, middle, last, suffix } = formData.spouseFullName;
  return (
    <div>
      <strong>{first} {middle && `${middle} `}{last}{suffix && `, ${suffix}`}</strong>
    </div>
  );
}
