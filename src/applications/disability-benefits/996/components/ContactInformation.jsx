import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { selectProfile } from 'platform/user/selectors';
import { formatAddress } from 'platform/forms/address/helpers';

import { PROFILE_URL } from '../constants';

const addBrAfter = line => line && [line, <br key={line} />];

export const ContactInfoDescription = ({ profile }) => {
  const { email, homePhone, mailingAddress } = profile?.vapContactInfo || {};
  const { street, cityStateZip, country } = formatAddress(mailingAddress || {});
  const phone = `${homePhone?.areaCode || ''}${homePhone?.phoneNumber || ''}`;

  return (
    <>
      <h3 className="vads-u-margin-top--0">Contact Information</h3>
      <p>
        This is the contact information we have on file for you. We’ll send any
        important information about your Higher-Level Review to this address.
      </p>
      <p className="vads-u-margin-top--1p5">
        You can{' '}
        <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
          update this information on your profile page
        </a>
        .
      </p>
      <div className="blue-bar-block">
        <h4 className="vads-u-font-size--h4">Phone &amp; email</h4>
        <p>
          <strong>Home phone</strong>:{' '}
          <Telephone
            contact={phone}
            extension={homePhone?.extension}
            notClickable
          />
        </p>
        <p>
          <strong>Email address</strong>: {email?.emailAddress || ''}
        </p>
        <h4 className="vads-u-font-size--h4">Mailing address</h4>
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
  profile: PropTypes.shape({}),
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const veteran = state.form?.data.veteran;
  return {
    profile,
    veteran,
  };
};

export default connect(mapStateToProps)(ContactInfoDescription);
