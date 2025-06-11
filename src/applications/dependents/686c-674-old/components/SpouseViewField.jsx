import React from 'react';

export default function SpouseViewField({ formData }) {
  const { first, middle, last, suffix } = formData.fullName;

  return (
    <div className="vads-u-padding--2">
      <strong>
        {first} {middle && `${middle} `}
        {last}
        {suffix && `, ${suffix}`}
      </strong>
      <br />
    </div>
  );
}
