import React from 'react';
import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';

export default function FacilityPhone({ contact }) {
  if (!contact) {
    return null;
  }

  const [number, extension] = contact.split('x');

  return <Telephone contact={number} extension={extension} />;
}
