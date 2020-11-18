import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { selectProfile } from 'platform/user/selectors';
import { formatAddress } from 'platform/forms/address/helpers';

const addBrAfter = line => line && [line, <br key={line} />];
const addBrBefore = line => line && [<br key={line} />, line];

export const formatPhone = (number = '') => {
  let i = 0;
  return number.length === 10
    ? '###-###-####'.replace(/#/g, () => number[i++] || '')
    : number;
};

export const ContactInfoDescription = ({ profile }) => {
  const { email, homePhone, mailingAddress } = profile.vapContactInfo;
  const { street, cityStateZip, country } = formatAddress(mailingAddress || {});
  const phone = `${homePhone?.areaCode || ''}${homePhone?.phoneNumber || ''}`;

  return (
    <>
      <p>
        This is the contact information we have on file for you. We’ll send any
        important information about your Higher-Level Review to this address.
      </p>
      <p className="vads-u-margin-top--1p5">
        You can update this information on your{' '}
        <a href="/profile" target="_blank" rel="noopener noreferrer">
          profile page
        </a>
        .
      </p>
      <div className="blue-bar-block">
        <h3 className="vads-u-font-size--h4">Phone &amp; email</h3>
        <p>
          <strong>Primary phone</strong>: {formatPhone(phone)}
        </p>
        <p>
          <strong>Email address</strong>: {email?.emailAddress || ''}
        </p>
        <h3 className="vads-u-font-size--h4">Mailing address</h3>
        <p>
          {addBrAfter(street)}
          {addBrAfter(cityStateZip)}
          {addBrBefore(country)}
          &nbsp;
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
