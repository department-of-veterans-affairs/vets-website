import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import AddressView from '@@vap-svc/components/AddressField/AddressView';

import { selectProfile } from 'platform/user/selectors';

import { readableList } from '../utils/helpers';

export const ContactInfoDescription = ({ formContext, profile, homeless }) => {
  const [hadError, setHadError] = useState(false);
  const { email = {}, mobilePhone = {}, mailingAddress = {} } =
    profile?.vapContactInfo || {};
  const { submitted } = formContext || {};

  // Don't require an address if the Veteran is homeless
  const requireAddress = homeless ? '' : 'address';
  const missingInfo = [
    email?.emailAddress ? '' : 'email',
    mobilePhone?.phoneNumber ? '' : 'phone',
    mailingAddress?.addressLine1 ? '' : requireAddress,
  ].filter(Boolean);

  const list = readableList(missingInfo);
  const plural = missingInfo.length > 1;
  const phoneNumber = `${mobilePhone?.areaCode ||
    ''}${mobilePhone?.phoneNumber || ''}`;
  const phoneExt = mobilePhone?.extension;

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

  // loop to separate pages
  const contactSection = (
    <>
      <h4 className="vads-u-font-size--h3">Mobile phone number</h4>
      <va-telephone contact={phoneNumber} extension={phoneExt} not-clickable />
      <p>
        <Link to="/edit-mobile-phone" aria-label="Edit mobile phone number">
          Edit
        </Link>
      </p>
      <h4 className="vads-u-font-size--h3">Email address</h4>
      <span>{email?.emailAddress || ''}</span>
      <p>
        <Link to="/edit-email-address" aria-label="Edit email address">
          Edit
        </Link>
      </p>
      <h4 className="vads-u-font-size--h3">Mailing address</h4>
      <AddressView data={mailingAddress} />
      <p>
        <Link to="/edit-mailing-address" aria-label="Edit mailing address">
          Edit
        </Link>
      </p>
    </>
  );

  return (
    <>
      <h3 className="vads-u-margin-top--0">Contact Information</h3>
      <p>
        This is the contact information we have on file for you. We’ll send any
        updates or information about your appeal to this address.
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
  homeless: PropTypes.bool,
};

const mapStateToProps = state => ({
  homeless: state.form.data.homeless,
  profile: selectProfile(state),
});

export default connect(mapStateToProps)(ContactInfoDescription);
