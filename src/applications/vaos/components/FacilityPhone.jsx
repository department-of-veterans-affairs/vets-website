import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export default function FacilityPhone({ contact }) {
  if (!contact) {
    return null;
  }

  const [number, extension] = contact.split('x');

  return <Telephone contact={number} extension={extension} />;
}
