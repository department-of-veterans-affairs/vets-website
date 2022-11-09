import React from 'react';

export default function ApplicantField({ formData }) {
  const { first, middle, last } = formData.fullName;

  return (
    <div>
      <strong>
        {first} {middle && `${middle} `}
        {last}
      </strong>
    </div>
  );
}
