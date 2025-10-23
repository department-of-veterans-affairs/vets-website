import React from 'react';
import PropTypes from 'prop-types';

const DateSubheading = ({ date, label, id, testId, labelClass }) => {
  return (
    <div
      className="time-header vads-u-margin-top--1 vads-u-margin-bottom--4"
      data-testid={testId}
    >
      <p className={labelClass ?? ''} id={id}>
        {label || 'Date'}:{' '}
        <span
          className="vads-u-font-weight--normal"
          data-dd-privacy="mask"
          data-dd-action-name="Progress note date"
          data-testid="header-time"
        >
          {date}
        </span>
      </p>
    </div>
  );
};

export default DateSubheading;

DateSubheading.propTypes = {
  date: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.any,
  labelClass: PropTypes.any,
  testId: PropTypes.string,
};
