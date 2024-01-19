import React from 'react';

export default function ApplicantField({ formData }) {
  const { first, middle, last, suffix } = formData.applicantName || {
    first: '',
    middle: '',
    last: '',
    suffix: '',
  };

  return (
    <div>
      <strong>
        {first} {middle && `${middle} `}
        {last}
        {suffix && `, ${suffix}`}
      </strong>
    </div>
  );
}
