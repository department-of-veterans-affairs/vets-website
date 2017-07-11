import React from 'react';

export function formatName(name) {
  const { first, middle, last, suffix } = name;
  return `${first} ${middle ? `${middle} ` : ''}${last}${suffix ? `, ${suffix}` : ''}`;
}

export function claimantHeader({ formData }) {
  const name = formatName(formData.claimant.name);
  return (
    <h4 className="highlight">{name}</h4>
  );
}
