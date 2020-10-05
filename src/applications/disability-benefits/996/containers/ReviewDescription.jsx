import React from 'react';

import { formatPhone, getCountryName } from '../content/contactInformation';

const ReviewDescription = ({ formData }) => {
  const veteran = formData?.veteran;
  if (!veteran) {
    return null;
  }
  // Label: formatted value
  const display = {
    'Phone number': () => formatPhone(veteran?.phoneNumber),
    'Email address': () => veteran?.emailAddress,
    Country: () => getCountryName(veteran?.country),
    'Street address': () => veteran?.street || '',
    'Line 2': () => veteran?.street2 || '',
    'Line 3': () => veteran?.street3 || '',
    City: () => veteran?.city || '',
    State: () => veteran?.state,
    'Postal code': () => veteran?.zipCode5,
  };

  return (
    <>
      <div className="form-review-panel-page-header-row">
        <h2 className="vads-u-font-size--h4 vads-u-margin--0">
          Contact information
        </h2>
        <a
          href="/profile"
          target="_blank"
          className="edit-btn primary-outline usa-button"
          aria-label="Edit on Profile"
        >
          Edit on Profile
        </a>
      </div>
      <dl className="review">
        {Object.entries(display).map(([label, getValue]) => {
          const value = getValue() || '';
          return value ? (
            <div key={label} className="review-row">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ) : null;
        })}
      </dl>
    </>
  );
};

export default ReviewDescription;
