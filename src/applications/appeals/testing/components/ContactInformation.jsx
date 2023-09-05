import React from 'react';
import { Link } from 'react-router';

const ContactInformation = () => (
  <div className="form-panel">
    <div className="vads-u-margin-y--2">
      <form>
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
        <div />
        <div className="blue-bar-block vads-u-margin-top--4">
          <div className="va-profile-wrapper">
            <h2 className="vads-u-width--auto">Mobile phone number</h2>
            <va-alert
              id="updated-mobile-phone"
              visible="false"
              className="vads-u-margin-y--1 hydrated"
              status="success"
              background-only="true"
              role="alert"
              uswds
            >
              Mobile phone number updated
            </va-alert>
            <span
              className="dd-privacy-hidden"
              data-dd-action-name="mobile phone"
            >
              <va-telephone
                contact="6195551234"
                not-clickable="true"
                className="hydrated"
                uswds
              />
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
            <h2 className="vads-u-width--auto">Email address</h2>
            <va-alert
              id="updated-email"
              visible="false"
              className="vads-u-margin-y--1 hydrated"
              status="success"
              background-only="true"
              role="alert"
              uswds
            >
              Email address updated
            </va-alert>
            <span className="dd-privacy-hidden" data-dd-action-name="email">
              myemail72585885@unattended.com
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
            <h2 className="vads-u-width--auto">Mailing address</h2>
            <va-alert
              id="updated-address"
              visible="false"
              className="vads-u-margin-y--1 hydrated"
              status="success"
              background-only="true"
              role="alert"
              uswds
            >
              Mailing address updated
            </va-alert>
            <div className="dd-privacy-hidden" data-dd-action-name="street">
              123 Mailing Address St., Apt 1
            </div>
            <div
              className="dd-privacy-hidden"
              data-dd-action-name="city, state and zip code"
            >
              Fulton, NY 97063
            </div>
            <p className="vads-u-margin-top--0p5">
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
      </form>
    </div>
  </div>
);

export default ContactInformation;
