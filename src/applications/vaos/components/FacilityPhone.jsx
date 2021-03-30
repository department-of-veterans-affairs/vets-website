import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export default function FacilityPhone({ contact, level }) {
  if (!contact) {
    return null;
  }

  const [number, extension] = contact.split('x');
  const Heading = `h${level}`;

  return (
    <>
      <Heading className="vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base">
        Main phone:
      </Heading>{' '}
      <Telephone contact={number} extension={extension} />
      <br />
      <Heading className="vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base">
        TTY:
      </Heading>{' '}
      <Telephone contact="711" />
    </>
  );
}
