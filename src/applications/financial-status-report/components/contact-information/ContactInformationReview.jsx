import React from 'react';
import { ADDRESS_TYPES } from 'platform/forms/address/helpers';
import titleCase from 'platform/utilities/data/titleCase';
import PropTypes from 'prop-types';
import { PROFILE_URL } from '../../constants';

const ContactInformationReview = props => {
  const {
    data: { personalData = {} },
  } = props;

  if (!personalData) {
    return null;
  }

  const { emailAddress, telephoneNumber, address } = personalData || {};
  const isUS = address?.addressType !== ADDRESS_TYPES.international;
  const stateOrProvince = isUS ? 'State' : 'Province';
  const phoneType = `${titleCase(
    (telephoneNumber?.phoneType || '').toLowerCase(),
  )} phone`;
  const vaHappyNumber = `${telephoneNumber?.areaCode}${
    telephoneNumber?.phoneNumber
  }`;

  // Label: formatted value in (design) display order
  const display = {
    [phoneType]: () =>
      telephoneNumber && (
        <va-telephone
          contact={vaHappyNumber}
          extension={telephoneNumber?.extension || ''}
          not-clickable
        />
      ),
    'Email address': () => emailAddress,
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

ContactInformationReview.propTypes = {
  data: PropTypes.shape({
    personalData: PropTypes.shape({
      emailAddress: PropTypes.string,
      telephoneNumber: PropTypes.shape({
        countryCode: PropTypes.string,
        areaCode: PropTypes.string,
        phoneNumber: PropTypes.string,
        extension: PropTypes.string,
      }),
      address: PropTypes.shape({
        addressLine1: PropTypes.string,
        addressLine2: PropTypes.string,
        addressLine3: PropTypes.string,
        city: PropTypes.string,
        province: PropTypes.string,
        stateCode: PropTypes.string,
        countryCodeIso3: PropTypes.string,
        zipCode: PropTypes.string,
        internationalPostalCode: PropTypes.string,
      }),
    }),
  }),
};

export default ContactInformationReview;
