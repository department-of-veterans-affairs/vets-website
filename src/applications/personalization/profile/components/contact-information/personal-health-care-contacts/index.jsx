import React from 'react';

import NextOfKin from './NextOfKin';
import EmergencyContact from './EmergencyContact';

const PersonalHealthCareContacts = () => {
  return (
    <section className="profile-info-card vads-u-margin-y--4 vads-u-border-color--gray-lighter vads-u-border--1px">
      <h2 className="heading vads-u-background-color--gray-lightest vads-u-border-color--gray-lighter vads-u-color--gray-darkest vads-u-border-bottom--1px vads-u-margin--0 vads-u-padding-x--2 vads-u-padding-y--1p5 vads-u-font-size--h3 medium-screen:vads-u-padding-x--4 medium-screen:vads-u-padding-y--2">
        Personal health care contacts
      </h2>

      <div className="vads-u-padding-x--2 medium-screen:vads-u-padding-x--4 vads-u-padding-y--2 medium-screen:vads-u-padding-y--4">
        <va-additional-info
          trigger="Learn how to update your personal health care contact information"
          uswds
        >
          <p>
            If this isn’t your correct information, a staff member can help
            update your information or you can call the help desk at
            <br />
            <va-telephone contact="8006982411" />
          </p>
        </va-additional-info>

        <div>
          <h3 className="vads-u-font-family--sans vads-u-font-size--base">
            Who we’ll contact in case of a medical emergency
          </h3>
          <EmergencyContact />
        </div>

        <div>
          <h3 className="vads-u-font-family--sans vads-u-font-size--base">
            Who you’d like to represent your wishes for care and medical
            documentation, if needed.
          </h3>
          <p className="vads-u-color--gray-medium">
            Your next of kin is often your closest living relative, like your
            spouse, child, parent, or sibling.
          </p>
          <NextOfKin />
        </div>
      </div>
    </section>
  );
};

export default PersonalHealthCareContacts;
