import React from 'react';

export default function ClaimantView({ formData }) {
  const {
    name: { first, middle, last, suffix },
    relationshipToVet
  } = formData.claimant;

  let relationship;

  switch (relationshipToVet.type) {
    case 1:
      relationship = 'Servicemember';
      break;
    case 2:
      relationship = 'Spouse';
      break;
    case 3:
      relationship = 'Child';
      break;
    default:
      // Invalid case; show nothing for relationship.
  }

  return (
    <div>
      <strong>{first} {middle && `${middle} `}{last}{suffix && `, ${suffix}`}</strong><br/>
      <div>{relationship}</div>
    </div>
  );
}
