import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import AddressView from '@@vap-svc/components/AddressField/AddressView';

import { selectProfile } from 'platform/user/selectors';

import { readableList, getPhoneString } from '../utils/helpers';

export const ContactInfoDescription = ({ formContext, profile }) => {
  const [hadError, setHadError] = useState(false);
  const { email = {}, homePhone = {}, mobilePhone = {}, mailingAddress = {} } =
    profile?.vapContactInfo || {};
  const { submitted } = formContext || {};

  const missingInfo = [
    homePhone?.phoneNumber || mobilePhone?.phoneNumber
      ? ''
      : 'home or mobile phone',
    email?.emailAddress ? '' : 'email',
    mailingAddress?.addressLine1 ? '' : 'address',
  ].filter(Boolean);

  const list = readableList(missingInfo);
  const plural = missingInfo.length > 1;

  const handler = {
    onSubmit: event => {
      // This prevents this nested form submit event from passing to the
      // outer form and causing a page advance
      event.stopPropagation();
    },
  };

  useEffect(
    () => {
      if (missingInfo.length) {
        // page had an error flag, so we know when to show a success alert
        setHadError(true);
      }
    },
    [missingInfo],
  );

  // loop to separate pages when editing
  const contactSection = (
    <>
      <h4 className="vads-u-font-size--h3 vads-u-margin-top--0p5 vads-u-width--auto vads-u-display--inline-block">
        Home phone number
      </h4>
      <Link
        to="/edit-home-phone"
        aria-label="Edit home phone number"
        className="vads-u-padding-left--2"
      >
        edit
      </Link>
      <div>
        <va-telephone
          contact={getPhoneString(homePhone)}
          extension={homePhone?.extension}
          not-clickable
        />
      </div>

      <h4 className="vads-u-font-size--h3 vads-u-width--auto vads-u-display--inline-block">
        Mobile phone number
      </h4>
      <Link
        to="/edit-mobile-phone"
        aria-label="Edit mobile phone number"
        className="vads-u-padding-left--2"
      >
        edit
      </Link>
      <div>
        <va-telephone
          contact={getPhoneString(mobilePhone)}
          extension={mobilePhone?.extension}
          not-clickable
        />
      </div>

      <h4 className="vads-u-font-size--h3 vads-u-width--auto vads-u-display--inline-block">
        Email address
      </h4>
      <Link
        to="/edit-email-address"
        aria-label="Edit email address"
        className="vads-u-padding-left--2"
      >
        edit
      </Link>
      <div>{email?.emailAddress || ''}</div>

      <h4 className="vads-u-font-size--h3 vads-u-width--auto vads-u-display--inline-block">
        Mailing address
      </h4>
      <Link
        to="/edit-mailing-address"
        aria-label="Edit mailing address"
        className="vads-u-padding-left--2"
      >
        edit
      </Link>
      <div>
        <AddressView data={mailingAddress} />
      </div>
    </>
  );

  return (
    <>
      <h3 className="vads-u-margin-top--0">Contact Information</h3>
      <p>
        This is the contact information we have on file for you. We’ll send any
        updates or information about your Supplemental Claim to this address.
      </p>
      <p>
        <strong>Note:</strong> Any updates you make here will be reflected in
        your VA.gov profile.
      </p>
      {hadError &&
        missingInfo.length === 0 && (
          <div className="vads-u-margin-top--1p5">
            <va-alert status="success" background-only>
              <div className="vads-u-font-size--base">
                The missing information has been added to your application. You
                may continue.
              </div>
            </va-alert>
          </div>
        )}
      {missingInfo.length > 0 && (
        <>
          <p className="vads-u-margin-top--1p5">
            <strong>Note:</strong>
            {missingInfo[0].startsWith('p') ? ' A ' : ' An '}
            {list} {plural ? 'are' : 'is'} required for this application.
          </p>
          {submitted && (
            <div className="vads-u-margin-top--1p5" role="alert">
              <va-alert status="error" background-only>
                <div className="vads-u-font-size--base">
                  We still don’t have your {list}. Please edit and update the
                  field.
                </div>
              </va-alert>
            </div>
          )}
          <div className="vads-u-margin-top--1p5" role="alert">
            <va-alert status="warning" background-only>
              <div className="vads-u-font-size--base">
                Your {list} {plural ? 'are' : 'is'} missing. Please edit and
                update the {plural ? 'fields' : 'field'}.
              </div>
            </va-alert>
          </div>
        </>
      )}
      <div className="blue-bar-block vads-u-margin-top--4">
        <div className="va-profile-wrapper" onSubmit={handler.onSubmit}>
          {contactSection}
        </div>
      </div>
    </>
  );
};

ContactInfoDescription.propTypes = {
  profile: PropTypes.shape({
    vapContactInfo: PropTypes.shape({
      email: PropTypes.shape({
        emailAddress: PropTypes.string,
      }),
      homePhone: PropTypes.shape({
        countryCode: PropTypes.string,
        areaCode: PropTypes.string,
        phoneNumber: PropTypes.string,
        extension: PropTypes.string,
      }),
      mobilePhone: PropTypes.shape({
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
  }).isRequired,
  formContext: PropTypes.shape({
    submitted: PropTypes.bool,
  }),
};

const mapStateToProps = state => ({
  profile: selectProfile(state),
});

export default connect(mapStateToProps)(ContactInfoDescription);
