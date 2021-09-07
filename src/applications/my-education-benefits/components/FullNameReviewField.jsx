import React from 'react';

export default function FullNameViewField({ formData }) {
  const { first, middle, last, suffix } = formData;

  return (
    <>
      <div className="review-row">
        <dt>Your full name</dt>
        <dd>
          {first} {middle && `${middle} `} {last} {suffix && `${suffix}`}
        </dd>
      </div>
    </>
  );
}
