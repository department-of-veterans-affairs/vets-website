import React from 'react';
import PropTypes from 'prop-types';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function FacilityPhone({
  contact,
  extension,
  className = 'vads-u-font-weight--bold',
  level,
  icon,
  heading = 'Main phone:',
}) {
  if (!contact) {
    return null;
  }

  let number = contact;
  let numberExtension = extension;

  // Extract number and extension from contact if extension not explicitly set and
  // contact contains an 'x' character, usually in the format "123-456-7890 x1234"
  if (!extension && contact.includes('x')) {
    [number, numberExtension] = contact.split('x').map(item => item.trim());
  }

  const isClinic = !!heading.includes('Clinic');
  const Heading = `h${level}`;

  return (
    <>
      {!!icon === false &&
        level && (
          <>
            <Heading
              className={`vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base ${className}`}
            >
              {heading}
            </Heading>{' '}
          </>
        )}
      {typeof icon === 'undefined' &&
        typeof level === 'undefined' &&
        `${heading} `}
      <VaTelephone
        contact={number}
        extension={numberExtension}
        data-testid={!isClinic ? 'facility-telephone' : 'clinic-telephone'}
      />
      {!isClinic && (
        <span>
          &nbsp;(
          <VaTelephone contact="711" tty data-testid="tty-telephone" />)
        </span>
      )}
    </>
  );
}

FacilityPhone.propTypes = {
  className: PropTypes.string,
  contact: PropTypes.string,
  extension: PropTypes.string,
  heading: PropTypes.string,
  icon: PropTypes.bool,
  level: PropTypes.number,
};
