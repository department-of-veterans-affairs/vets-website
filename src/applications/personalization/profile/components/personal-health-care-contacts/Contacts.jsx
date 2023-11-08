import React from 'react';
import { useSelector } from 'react-redux';

import { selectEmergencyContact, selectNextOfKin } from '@@profile/selectors';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import Contact from './Contact';

const HelpDeskContact = () => (
  <>
    <va-telephone data-testid="va-800-number" contact={CONTACTS.HELP_DESK} /> (
    <va-telephone data-testid="va-711-number" contact={CONTACTS['711']} tty />)
  </>
);

const Contacts = () => {
  const emergencyContact = useSelector(selectEmergencyContact);
  const nextOfKin = useSelector(selectNextOfKin);

  return (
    <>
      <div className="vads-u-margin-bottom--3">
        <va-additional-info
          className=""
          data-testid="phcc-how-to-update"
          trigger="Learn how to update your personal health care contact information"
          uswds
        >
          If this information isn’t correct, here’s how to update it:
          <ul className="vads-u-margin-y--0">
            <li>Ask a staff member at your next appointment, or</li>
            <li>
              Call us at <HelpDeskContact />. We’re here 24/7.
            </li>
          </ul>
        </va-additional-info>
      </div>

      <section className="profile-info-card">
        <div className="row vads-u-border-color--gray-lighter vads-u-color-gray-dark vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2 vads-u-padding-y--1p5 medium-screen:vads-u-padding--4 vads-u-border--1px">
          <h2 className="vads-u-font-family--sans vads-u-font-size--base vads-u-margin--0">
            Medical emergency contact
          </h2>
          <p className="vads-u-color--gray-medium vads-u-margin-top--1 vads-u-margin-bottom--1">
            The person we’ll contact in an emergency.
          </p>
          {emergencyContact && (
            <Contact
              testId="phcc-emergency-contact"
              key={emergencyContact.id}
              {...emergencyContact.attributes}
            />
          )}
          {!emergencyContact && (
            <div>
              To add an emergency contact, call us at <HelpDeskContact />.
            </div>
          )}
        </div>

        <div className="row vads-u-border-color--gray-lighter vads-u-color-gray-dark vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2 vads-u-padding-y--1p5 medium-screen:vads-u-padding--4 vads-u-border-left--1px vads-u-border-right--1px vads-u-border-bottom--1px">
          <h2 className="vads-u-font-family--sans vads-u-font-size--base vads-u-margin--0">
            Next of kin contact
          </h2>
          <p className="vads-u-color--gray-medium vads-u-margin-top--1 vads-u-margin-bottom--1">
            The person you want to represent your health care wishes if needed.
          </p>
          {nextOfKin && (
            <Contact
              testId="phcc-next-of-kin"
              key={nextOfKin.id}
              {...nextOfKin.attributes}
            />
          )}
          {!nextOfKin && (
            <div>
              To add a next of kin, call us at <HelpDeskContact />.
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Contacts;
