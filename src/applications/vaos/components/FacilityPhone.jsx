import React from 'react';
import PropTypes from 'prop-types';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function FacilityPhone({
  contact = '800-698-2411',
  extension,
  className = '',
  level,
  icon,
  heading = 'Phone: ',
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

  let dataTestId = 'facility-telephone';
  if (number === '800-698-2411') {
    dataTestId = 'main-telephone';
  } else if (isClinic) {
    dataTestId = 'clinic-telephone';
  }

  return (
    <>
      {!!icon === false && level && (
        <>
          <Heading className={`vads-u-display--inline ${className}`}>
            {heading}
          </Heading>{' '}
        </>
      )}
      {typeof icon === 'undefined' && typeof level === 'undefined' && (
        <span className={className}>{heading}</span>
      )}
      <VaTelephone
        contact={number}
        extension={numberExtension}
        data-testid={dataTestId}
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
