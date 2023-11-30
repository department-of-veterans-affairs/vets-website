import React from 'react';
import PropTypes from 'prop-types';

const DateSubheading = ({ date, label, id }) => {
  return (
    <div className="time-header vads-u-display--inline-block">
      <p
        className="vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--bold vads-u-margin--0"
        id={id}
      >
        {label || 'Date'}:{' '}
        <span
          className="vads-u-font-weight--normal"
          data-dd-privacy="mask"
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
};
