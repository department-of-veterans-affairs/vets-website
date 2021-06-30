import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import { selectProfile } from 'platform/user/selectors';
import { formatAddress } from 'platform/forms/address/helpers';
import titleCase from 'platform/utilities/data/titleCase';
import { refreshProfile as refreshProfileAction } from 'platform/user/profile/actions';

import { PROFILE_URL } from '../constants';
import { readableList } from '../utils/helpers';

const addBrAfter = line => line && [line, <br key={line} />];

export const ContactInfoDescription = ({
  formContext,
  profile,
  refreshProfile,
}) => {
  const [hasUpdated, setHasUpdated] = useState(false);
  const [hadError, setHadError] = useState(false);

  /* use vapContactInfo because it comes directly from the profile, so when the
   * Veteran clicks the "I've updated" button, we refresh the in-memory profile
   * data. Once that is done, the FormApp outer wrapper _should_ automatically
   * update the formData.veteran for email, phone & address - this is convoluted
   * but it's the only way to block the form system continue button to prevent
   * continuing on in the form when we're missing essential details;
   * alternatively, we could have added prefill form elements for all this
   * required info, but while presenting this to the board, they remarked that
   * the profile data isn't being updated, so the form contact info may not
   * match what's in profile... once the profile team provides a way to inline
   * contact info changes, we can replace this code.
   */
  const { email = {}, mobilePhone = {}, homePhone = {}, mailingAddress = {} } =
    profile?.vapContactInfo || {};
  const phone = mobilePhone?.phoneNumber ? mobilePhone : homePhone;
  const { submitted } = formContext || {};
  // const emails = {};

  // phone.phoneType is in all caps
  const phoneType = titleCase((phone?.phoneType || '').toLowerCase());
  const { street, cityStateZip, country } = formatAddress(mailingAddress || {});
  const missingInfo = [
    email?.emailAddress ? '' : 'email',
    phoneType ? '' : 'phone',
    street ? '' : 'address',
  ].filter(Boolean);

  const list = readableList(missingInfo);
  const plural = missingInfo.length > 1;

  useEffect(
    () => {
      if (missingInfo.length) {
        // page had an error flag, so we know when to show a success alert
        setHadError(true);
      }
    },
    [missingInfo],
  );

  const profileLink = text => (
    <a
      href={PROFILE_URL}
      className="profile-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </a>
  );

  return (
    <>
      <p>
        This is the contact information we have on file for you. We’ll send any
        updates or information about your Board Appeal request to this address.
      </p>
      <p className="vads-u-margin-top--1p5">
        You can{' '}
        {profileLink(
          'update this contact information in your VA.gov profile (opens in new tab)',
        )}
        .
      </p>
      {hadError &&
        hasUpdated &&
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
          {(hasUpdated || submitted) && (
            <div className="vads-u-margin-top--1p5" role="alert">
              <va-alert status="error" background-only>
                <div className="vads-u-font-size--base">
                  We still don’t have your {list}. Please{' '}
                  {profileLink(`add your ${list} in your profile.`)}
                </div>
              </va-alert>
            </div>
          )}
          <div className="vads-u-margin-top--1p5" role="alert">
            <va-alert status="warning" background-only>
              <div className="vads-u-font-size--base">
                Your {list} {plural ? 'are' : 'is'} missing. Please{' '}
                {profileLink(`add ${plural ? 'them' : 'it'} in your profile`)}{' '}
                and return to this page. When you’re done, please click the
                button to confirm your {list} {plural ? 'have' : 'has'} been
                updated.
              </div>
              <button
                type="button"
                className="vads-u-width--auto"
                onClick={event => {
                  event.preventDefault();
                  setHasUpdated(true);
                  refreshProfile(true);
                }}
              >
                My contact details have been updated
              </button>
            </va-alert>
          </div>
        </>
      )}
      <div className="blue-bar-block">
        <h3 className="vads-u-font-size--h4">Phone &amp; email</h3>
        <p>
          <strong>{phoneType} phone</strong>:{' '}
          {phone?.phoneNumber && (
            <Telephone
              contact={`${phone?.areaCode || ''}${phone?.phoneNumber || ''}`}
              extension={phone?.extension}
              notClickable
            />
          )}
        </p>
        <p>
          <strong>Email address</strong>: {email?.emailAddress || ''}
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

const mapDispatchToProps = {
  refreshProfile: refreshProfileAction,
};

const mapStateToProps = state => ({
  veteran: state.form?.data.veteran,
  profile: selectProfile(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactInfoDescription);
