import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ADDRESS_TYPES } from 'platform/forms/address/helpers';
import titleCase from 'platform/utilities/data/titleCase';

import { PROFILE_URL } from '../constants';

const ReviewDescription = ({ veteran }) => {
  if (!veteran) {
    return null;
  }

  const { email, phone, address } = veteran || {};
  const isUS = address?.addressType !== ADDRESS_TYPES.international;
  const stateOrProvince = isUS ? 'State' : 'Province';
  const phoneType = `${titleCase(
    (phone?.phoneType || '').toLowerCase(),
  )} phone`;

  // Label: formatted value in (design) display order
  const display = {
    [phoneType]: () =>
      phone && (
        <va-telephone
          contact={`${phone?.areaCode}${phone?.phoneNumber}`}
          extension={phone?.extension || ''}
          not-clickable
        />
      ),
    'Email address': () => email,
    Country: () => (isUS ? '' : address?.countryName),
    'Street address': () => address?.addressLine1,
    'Street address line 2': () => address?.addressLine2,
    'Street address line 3': () => address?.addressLine3,
    City: () => address?.city,
    [stateOrProvince]: () => address?.[isUS ? 'stateCode' : 'province'],
    'Postal code': () =>
      address?.[isUS ? 'zipCode' : 'internationalPostalCode'],
  };

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="vads-u-font-size--h5 vads-u-margin--0">
          Contact information
        </h4>
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="vads-u-margin-right--1"
          aria-label="Edit contact information in your profile"
        >
          Edit Profile
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
    </div>
  );
};

ReviewDescription.propTypes = {
  veteran: PropTypes.shape({
    email: PropTypes.string,
    phone: PropTypes.shape({}),
    address: PropTypes.shape({}),
  }),
};

const mapStateToProps = state => ({
  veteran: state.form.data.veteran,
});

export { ReviewDescription };

export default connect(mapStateToProps)(ReviewDescription);
