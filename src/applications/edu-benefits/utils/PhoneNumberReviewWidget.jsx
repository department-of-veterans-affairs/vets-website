import React from 'react';
import PropTypes from 'prop-types';

export const PhoneNumberReviewWidget = ({ value }) => {
  const cleanValue = value?.replace(/[^0-9]/g, '');
  let formatted = cleanValue;

  if (cleanValue && cleanValue.length === 10) {
    formatted = `(${cleanValue.substr(0, 3)}) ${cleanValue.substr(
      3,
      3,
    )}-${cleanValue.substr(6)}`;
  }

  return (
    <span
      className="dd-privacy-hidden"
      data-dd-action-name="phone number"
      data-testid="phone-number-review"
    >
      {formatted}
    </span>
  );
};

PhoneNumberReviewWidget.propTypes = {
  value: PropTypes.string,
};
