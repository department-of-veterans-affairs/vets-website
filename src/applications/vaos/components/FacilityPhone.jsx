import React from 'react';
import PropTypes from 'prop-types';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function FacilityPhone({ contact, className, level }) {
  if (!contact) {
    return null;
  }

  const [number, extension] = contact.split('x');
  const Heading = `h${level}`;

  return (
    <>
      <Heading
        className={`vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base ${className}`}
      >
        Main phone:
      </Heading>{' '}
      <VaTelephone
        contact={number}
        extension={extension}
        data-testid="facility-telephone"
      />
      <br />
      <Heading
        className={`vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base ${className}`}
      >
        TTY:
      </Heading>{' '}
      <VaTelephone contact="711" data-testid="tty-telephone" />
    </>
  );
}

FacilityPhone.propTypes = {
  className: PropTypes.string,
  contact: PropTypes.string,
  level: PropTypes.number,
};
