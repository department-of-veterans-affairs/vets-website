import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { selectProfile } from 'platform/user/selectors';
import { ADDRESS_TYPES } from 'platform/forms/address/helpers';
import { PROFILE_URL } from '../constants';

const ReviewDescription = ({ profile }) => {
  if (!profile) {
    return null;
  }

  const { email, homePhone, mailingAddress } = profile.vapContactInfo || {};
  const isUS = mailingAddress?.addressType !== ADDRESS_TYPES.international;
  const stateOrProvince = isUS ? 'State' : 'Province';

  // Label: formatted value in (design) display order
  const display = {
    'Phone number': () =>
      homePhone && (
        <Telephone
          contact={`${homePhone?.areaCode}${homePhone?.phoneNumber}`}
          extension={homePhone?.extension || ''}
          notClickable
        />
      ),
    'Email address': () => email?.emailAddress,
    Country: () => (isUS ? '' : mailingAddress?.countryName),
    'Street address': () => mailingAddress?.addressLine1,
    'Line 2': () => mailingAddress?.addressLine2,
    'Line 3': () => mailingAddress?.addressLine3,
    City: () => mailingAddress?.city,
    [stateOrProvince]: () => mailingAddress?.[isUS ? 'stateCode' : 'province'],
    'Postal code': () =>
      mailingAddress?.[isUS ? 'zipCode' : 'internationalPostalCode'],
  };

  return (
    <>
      <div className="form-review-panel-page-header-row">
        <h4 className="vads-u-font-size--h4 vads-u-margin--0">
          Contact information
        </h4>
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="vads-u-margin-right--1"
          aria-label="Edit contact information on profile"
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

ReviewDescription.propTypes = {
  profile: PropTypes.shape({}),
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  return { profile };
};

export { ReviewDescription };

export default connect(mapStateToProps)(ReviewDescription);
