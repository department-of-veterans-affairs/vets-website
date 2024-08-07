import React from 'react';

export default function SpouseViewField({ formData }) {
  const { first, middle, last, suffix } = formData.fullName;

  return (
    <div className="vads-u-display--flex">
      <h4 className="vads-u-margin-y--2">
        {first} {middle && `${middle} `}
        {last}
        {suffix && `, ${suffix}`}
      </h4>
      <br />
    </div>
  );
}
