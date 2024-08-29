import React from 'react';
import { Link } from 'react-router';

import { getPhoneString } from '../utils/contactInfo';

const ContactInformation = ({ formData }) => {
  const { veteran } = formData || {};
  const homePhone = getPhoneString(veteran.homePhone);
  const mobilePhone = getPhoneString(veteran.mobilePhone);
  const { addressLine1, city, stateCode, zipCode } = veteran.address;

  return (
    <div className="form-panel">
      <div className="vads-u-margin-y--2">
        <h1
          id="confirmContactInformationHeader"
          className="vads-u-margin-top--0"
        >
          Contact information
        </h1>
        <p>
          This is the contact information we have on file for you. We’ll send
          any updates or information about your appeal to this address.
        </p>
        <p>
          <strong>Note:</strong> Any updates you make here will be reflected in
          your VA.gov profile.
        </p>
        <div className="blue-bar-block vads-u-margin-top--4">
          <div className="va-profile-wrapper">
            <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--0p5 vads-u-width--auto">
              Home phone number
            </h2>
            <span
              className="dd-privacy-hidden"
              data-dd-action-name="home phone"
            >
              <va-telephone contact={homePhone} not-clickable="true" uswds />
            </span>
            <p className="vads-u-margin-top--0p5">
              <Link
                id="edit-home-phone"
                aria-label="Edit home phone number"
                to="/edit-home-phone"
              >
                edit
              </Link>
            </p>
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--0p5 vads-u-width--auto">
              Mobile phone number
            </h2>
            <span
              className="dd-privacy-hidden"
              data-dd-action-name="mobile phone"
            >
              <va-telephone contact={mobilePhone} not-clickable="true" uswds />
            </span>
            <p className="vads-u-margin-top--0p5">
              <Link
                id="edit-mobile-phone"
                aria-label="Edit mobile phone number"
                to="/edit-mobile-phone"
              >
                edit
              </Link>
            </p>
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--0p5 vads-u-width--auto">
              Email address
            </h2>
            <span className="dd-privacy-hidden" data-dd-action-name="email">
              {veteran.email}
            </span>
            <p className="vads-u-margin-top--0p5">
              <Link
                id="edit-email"
                aria-label="Edit email address"
                to="/edit-email-address"
              >
                edit
              </Link>
            </p>
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--0p5 vads-u-width--auto">
              Mailing address
            </h2>
            <div className="dd-privacy-hidden" data-dd-action-name="street">
              {addressLine1}
            </div>
            <div
              className="dd-privacy-hidden"
              data-dd-action-name="city, state and zip code"
            >
              {`${city}, ${stateCode} ${zipCode}`}
            </div>
            <p className="vads-u-margin-top--0p5 vads-u-padding-bottom--1">
              <Link
                id="edit-address"
                aria-label="Edit mailing address"
                to="/edit-mailing-address"
              >
                edit
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
