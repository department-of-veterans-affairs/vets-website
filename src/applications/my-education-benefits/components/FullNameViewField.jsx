import React from 'react';

export default function FullNameViewField({ formData }) {
  const { first, middle, last, suffix } = formData;

  return (
    <>
      {first} {middle && `${middle} `} {last} {suffix && `${suffix}`}
    </>
  );
}
