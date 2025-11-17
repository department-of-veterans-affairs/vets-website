import React from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import PropTypes from 'prop-types';

export default function CardSection({
  dateContent,
  textContent,
  heading,
  level = 2,
}) {
  const Heading = `h${level}`;

  return (
    <>
      <Heading className="vads-u-font-size--h4 vads-u-margin-bottom--0p5">
        {heading}
      </Heading>
      {textContent && (
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
          {textContent}
        </p>
      )}
      {dateContent && (
        <>
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            {' '}
            {formatInTimeZone(
              dateContent.date,
              dateContent.timezone,
              'EEEE, MMMM d, yyyy',
            )}{' '}
          </p>
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            {formatInTimeZone(
              dateContent.date,
              dateContent.timezone,
              'h:mm aaaa',
            )}{' '}
            {formatInTimeZone(dateContent.date, dateContent.timezone, 'z')}
          </p>
        </>
      )}
    </>
  );
}

CardSection.propTypes = {
  dateContent: PropTypes.object,
  heading: PropTypes.string,
  level: PropTypes.number,
  textContent: PropTypes.string,
};
