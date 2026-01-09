import React from 'react';
import PropTypes from 'prop-types';

export default function PhoneView({ data }) {
  if (!data) {
    return null;
  }

  const number = data.isInternational
    ? data.phoneNumber
    : `${data.areaCode} ${data.phoneNumber}`;

  return (
    <va-telephone
      country-code={data.isInternational ? data.countryCode : null}
      contact={number}
      extension={data.extension}
      not-clickable
    />
  );
}

PhoneView.propTypes = {
  data: PropTypes.shape({
    isInternational: PropTypes.bool,
    countryCode: PropTypes.string,
    areaCode: PropTypes.string,
    phoneNumber: PropTypes.string.isRequired,
    extension: PropTypes.string,
  }),
};
