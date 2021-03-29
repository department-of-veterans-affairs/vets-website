import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export default function FacilityPhone({ contact }) {
  if (!contact) {
    return null;
  }

  const [number, extension] = contact.split('x');

  return (
    <>
      <Telephone contact={number} extension={extension} />
      <br />
      <h4 className="vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base">
        TTY:
      </h4>{' '}
      <Telephone contact="711" />
    </>
  );
}
