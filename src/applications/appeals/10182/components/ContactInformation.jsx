import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { formatAddress } from 'platform/forms/address/helpers';
import titleCase from 'platform/utilities/data/titleCase';

import { PROFILE_URL } from '../constants';

const addBrAfter = line => line && [line, <br key={line} />];

export const ContactInfoDescription = ({ veteran }) => {
  const { email, phone, address } = veteran || {};
  const { street, cityStateZip, country } = formatAddress(address || {});
  // phone.phoneType is in all caps
  const phoneType = titleCase((phone.phoneType || '').toLowerCase());

  return (
    <>
      <p>
        This is the contact information we have on file for you. We’ll send any
        updates or information about your Board Appeal request to this address.
      </p>
      <p className="vads-u-margin-top--1p5">
        You can{' '}
        <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
          update this contact information in your VA.gov profile (opens in new
          tab)
        </a>
        .
      </p>
      {(!phoneType || !street) && (
        <p className="vads-u-margin-top--1p5">
          <strong>Note:</strong> A phone number and mailing address is required
          for this application.
        </p>
      )}
      <div className="blue-bar-block">
        <h3 className="vads-u-font-size--h4">Phone &amp; email</h3>
        <p>
          <strong>{phoneType} phone</strong>:{' '}
          <Telephone
            contact={`${phone?.areaCode || ''}${phone?.phoneNumber || ''}`}
            extension={phone?.extension}
            notClickable
          />
        </p>
        <p>
          <strong>Email address</strong>: {email || ''}
        </p>
        <h3 className="vads-u-font-size--h4">Mailing address</h3>
        <p>
          {addBrAfter(street)}
          {addBrAfter(cityStateZip)}
          {country}
        </p>
      </div>
    </>
  );
};

ContactInfoDescription.propTypes = {
  veteran: PropTypes.shape({
    email: PropTypes.string,
    phone: PropTypes.shape({
      countryCode: PropTypes.string,
      areaCode: PropTypes.string,
      phoneNumber: PropTypes.string,
      extension: PropTypes.string,
    }),
    address: PropTypes.shape({
      addressType: PropTypes.string,
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
  }).isRequired,
};

const mapStateToProps = state => ({
  veteran: state.form?.data.veteran,
});

export default connect(mapStateToProps)(ContactInfoDescription);
