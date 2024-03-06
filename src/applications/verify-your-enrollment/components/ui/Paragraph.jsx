import React from 'react';
import PropTypes from 'prop-types';

const Paragraph = ({ title, date, className }) => {
  return (
    <p
      className={`vads-u-font-size--md vads-u-font-family--serif vads-u-font-weight--bold ${className}`}
    >
      {title}:
      <span className="vads-u-font-weight--normal vads-u-font-family--sans text-color vads-u-display--inline-block vads-u-margin-left--1">
        {date}
      </span>
    </p>
  );
};

Paragraph.propTypes = {
  className: PropTypes.string,
  date: PropTypes.string,
  title: PropTypes.string,
};
export default Paragraph;
