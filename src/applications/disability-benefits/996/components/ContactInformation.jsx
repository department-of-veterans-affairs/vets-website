import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import AddressView from '@@vap-svc/components/AddressField/AddressView';

import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
import VAPServicePendingTransactionCategory from '@@vap-svc/containers/VAPServicePendingTransactionCategory';
import PhoneField from '@@vap-svc/components/PhoneField/PhoneField';
import EmailField from '@@vap-svc/components/EmailField/EmailField';
import AddressField from '@@vap-svc/components/AddressField/AddressField';
import { TRANSACTION_CATEGORY_TYPES, FIELD_NAMES } from '@@vap-svc/constants';

import { selectProfile } from 'platform/user/selectors';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import { readableList } from '../utils/helpers';

export const ContactInfoDescription = ({
  formContext,
  profile,
  homeless,
  loopPages,
}) => {
  const [hadError, setHadError] = useState(false);
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

  const phoneNumber = `${mobilePhone.areaCode}${mobilePhone?.phoneNumber}`;
  const phoneExt = mobilePhone?.extension;

  useEffect(
    () => {
      if (missingInfo.length) {
        // page had an error flag, so we know when to show a success alert
        setHadError(true);
      }
    },
    [missingInfo],
  );

  // loop to separate pages vs profile contact modals
  const contactSection = loopPages ? (
    <>
      <h3>Mobile phone number</h3>
      <Telephone contact={phoneNumber} extension={phoneExt} notClickable />
      <p>
        <Link to="/edit-mobile-phone">
          Edit
          <span className="sr-only">mobile phone number</span>
        </Link>
      </p>
      <h3>Email address</h3>
      <span>{email?.emailAddress || ''}</span>
      <p>
        <Link to="/edit-email-address">
          Edit
          <span className="sr-only">email address</span>
        </Link>
      </p>
      <h3>Mailing address</h3>
      <AddressView data={mailingAddress} />
      <p>
        <Link to="/edit-mailing-address">
          Edit
          <span className="sr-only">mailing address</span>
        </Link>
      </p>
    </>
  ) : (
    <InitializeVAPServiceID>
      <VAPServicePendingTransactionCategory
        categoryType={TRANSACTION_CATEGORY_TYPES.PHONE}
      >
        <PhoneField
          title="Mobile phone number"
          fieldName={FIELD_NAMES.MOBILE_PHONE}
          deleteDisabled
          alertClosingDisabled
        />
      </VAPServicePendingTransactionCategory>
      <VAPServicePendingTransactionCategory
        categoryType={TRANSACTION_CATEGORY_TYPES.EMAIL}
      >
        <EmailField
          title="Email address"
          fieldName={FIELD_NAMES.EMAIL}
          deleteDisabled
        />
      </VAPServicePendingTransactionCategory>
      <VAPServicePendingTransactionCategory
        categoryType={TRANSACTION_CATEGORY_TYPES.ADDRESS}
      >
        <AddressField
          title="Mailing address"
          fieldName={FIELD_NAMES.MAILING_ADDRESS}
          deleteDisabled
        />
      </VAPServicePendingTransactionCategory>
    </InitializeVAPServiceID>
  );

  return (
    <>
      <h3 className="vads-u-margin-top--0">Contact Information</h3>
      <p>
        This is the contact information we have on file for you. We’ll send any
        updates or information about your Higher-Level Review to this address.
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
        <div
          className="va-profile-wrapper"
          onSubmit={event => {
            // This prevents this nested form submit event from passing to the
            // outer form and causing a page advance
            event.stopPropagation();
          }}
        >
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
  homeless: PropTypes.bool,
  loopPages: PropTypes.bool,
};

const mapStateToProps = state => ({
  homeless: state.form.data.homeless,
  profile: selectProfile(state),
  loopPages: toggleValues(state)[FEATURE_FLAG_NAMES.loopPages],
});

export default connect(mapStateToProps)(ContactInfoDescription);
