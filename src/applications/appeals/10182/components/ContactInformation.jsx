import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
import ContactInformationField from '@@vap-svc/components/ContactInformationField';
import { FIELD_NAMES } from '@@vap-svc/constants';

import { selectProfile } from '~/platform/user/selectors';

import { readableList } from '../utils/helpers';

export const ContactInfoDescription = ({ formContext, profile, homeless }) => {
  const [hadError, setHadError] = useState(false);

  /* use vapContactInfo because it comes directly from the profile. We're using
   * VAP components to render the information along with an edit button. Editing
   * and updating will refresh the store user > profile > vapContactInfo. Once
   * that is done, the FormApp outer wrapper _should_ automatically update the
   * formData.veteran for email, phone & address - the validation function then
   * checks for these values and prevents or allows advancement in the form -
   * this is convoluted but it's the only way to block the form system continue
   * button to prevent continuing on in the form when we're missing essential
   * details; this also prevents the modal with a nested form from causing the
   * page to advance upon updating the modal content
   */
  const { email = {}, mobilePhone = {}, mailingAddress = {} } =
    profile?.vapContactInfo || {};
  const { submitted } = formContext || {};

  // Don't require an address if the Veteran is homeless
  const requireAddress = homeless ? '' : 'address';

  const missingInfo = [
    email?.emailAddress ? '' : 'email',
    mobilePhone?.phoneNumber ? '' : 'phone',
    mailingAddress.addressLine1 ? '' : requireAddress,
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

  return (
    <>
      <p>
        This is the contact information we have on file for you. We’ll send any
        updates or information about your Board Appeal request to this address.
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
      <div
        className="va-profile-wrapper blue-bar-block vads-u-margin-y--4"
        onSubmit={event => {
          // This prevents this nested form submit event from passing to the
          // outer form and causing a page advance
          event.stopPropagation();
        }}
      >
        <InitializeVAPServiceID>
          <h3>Mobile phone number</h3>
          <ContactInformationField
            fieldName={FIELD_NAMES.MOBILE_PHONE}
            isDeleteDisabled
          />
          <h3>Email address</h3>
          <ContactInformationField
            fieldName={FIELD_NAMES.EMAIL}
            isDeleteDisabled
          />
          <h3>Mailing address</h3>
          <ContactInformationField
            fieldName={FIELD_NAMES.MAILING_ADDRESS}
            isDeleteDisabled
          />
        </InitializeVAPServiceID>
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
  homeless: PropTypes.bool,
};

const mapStateToProps = state => ({
  homeless: state.form.data.homeless,
  profile: selectProfile(state),
});

export default connect(mapStateToProps)(ContactInfoDescription);
