import React from 'react';
import PropTypes from 'prop-types';

// When coming from a PhoneNumberWidget (not review), value will be only numbers
export default function PhoneNumberWidget({ value }) {
  let formatted = value;
  if (value && value.length === 10) {
    formatted = <va-telephone contact={value} not-clickable />;
  }

  return (
    <span className="dd-privacy-hidden" data-dd-action-name="phone number">
      {formatted}
    </span>
  );
}

PhoneNumberWidget.propTypes = {
  value: PropTypes.string,
};
