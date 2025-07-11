import React from 'react';
import PropTypes from 'prop-types';

export default function ARNWidget({ value }) {
  if (value && value.length >= 7 && value.length <= 9) {
    return (
      <span
        className="dd-privacy-hidden"
        data-dd-action-name="Alien registration number"
      >
        {`${value.substring(0, 3)}-${value.substring(3, 6)}-${value.substring(
          6,
        )}`}
      </span>
    );
  }

  return (
    <span
      className="dd-privacy-hidden"
      data-dd-action-name="Alien registration number"
    >
      {value}
    </span>
  );
}

ARNWidget.propTypes = {
  value: PropTypes.string,
};
