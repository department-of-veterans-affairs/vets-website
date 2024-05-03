import React from 'react';
import PropTypes from 'prop-types';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import classNames from 'classnames';

export default function FacilityPhone({
  contact,
  className = 'vads-u-font-weight--bold',
  level,
  icon,
  heading = 'Main phone:',
}) {
  if (!contact) {
    return null;
  }

  const [number, extension] = contact.split('x');
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
        <i
          aria-hidden="true"
          className={classNames(
            'fas',
            'fa-phone-alt',
            'vads-u-margin-right--1',
            'vads-u-color--gray',
          )}
        />
      )}
      <VaTelephone
        contact={number}
        extension={extension}
        data-testid="facility-telephone"
      />{' '}
      (<VaTelephone contact="711" tty data-testid="tty-telephone" />)
    </>
  );
}

FacilityPhone.propTypes = {
  className: PropTypes.string,
  contact: PropTypes.string,
  heading: PropTypes.string,
  icon: PropTypes.bool,
  level: PropTypes.number,
};
