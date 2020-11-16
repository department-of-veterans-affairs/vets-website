import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { selectProfile } from 'platform/user/selectors';

import { formatPhone } from './ContactInformation';
import { ADDRESS_TYPES, formatAddress } from 'platform/forms/address/helpers';

const ReviewDescription = ({ profile }) => {
  if (!profile) {
    return null;
  }

  const { email, homePhone, mailingAddress } = profile.vapContactInfo;
  const address = formatAddress(mailingAddress);
  const isUS = mailingAddress.addressType !== ADDRESS_TYPES.international;
  const stateOrProvince = isUS ? 'State' : 'Province';

  // Label: formatted value in (design) display order
  const display = {
    'Phone number': () =>
      formatPhone(`${homePhone?.areaCode}${homePhone?.phoneNumber}`),
    'Email address': () => email.emailAddress,
    Country: () => address.country,
    'Street address': () => address.addressLine1,
    'Line 2': () => address.addressLine2,
    'Line 3': () => address.addressLine3,
    City: () => address.city,
    [stateOrProvince]: () => address.stateOrProvince,
    'Postal code': () => address.zipOrPostalCode,
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

ReviewDescription.propTypes = {
  profile: PropTypes.shape({}),
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  return { profile };
};

export { ReviewDescription };

export default connect(mapStateToProps)(ReviewDescription);
