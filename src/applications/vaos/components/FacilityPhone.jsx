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
      {!!icon === true && (
        <span>
          <va-icon icon="phone" size="3" srtext="Phone icon" />{' '}
        </span>
      )}
      <VaTelephone
        contact={contact}
        extension={extension}
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
