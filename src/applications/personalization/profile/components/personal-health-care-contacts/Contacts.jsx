import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import Contact from './Contact';

const Instructions = ({ testId }) => (
  <div data-testid={testId}>
    To add a contact, call us at <HelpDeskContact testId={testId} />.
  </div>
);

Instructions.propTypes = {
  testId: PropTypes.string,
};

const HelpDeskContact = ({ testId }) => (
  <>
    <va-telephone
      data-testid={`${testId}-va-800-number`}
      contact={CONTACTS.HELP_DESK}
    />{' '}
    (
    <va-telephone
      data-testid={`${testId}-va-711-number`}
      contact={CONTACTS['711']}
      tty
    />
    )
  </>
);

HelpDeskContact.propTypes = {
  testId: PropTypes.string,
};

const Contacts = ({ data }) => {
  const ecs = data.filter(el => el.id.match(/emergency contact/i));
  const noks = data.filter(el => el.id.match(/next of kin/i));

  const renderEmergencyContacts =
    ecs && ecs.length ? (
      ecs.map((ec, i) => (
        <Contact
          testId={`phcc-emergency-contact-${i}`}
          key={ec.id}
          index={i}
          {...ec.attributes}
        />
      ))
    ) : (
      <Instructions testId="phcc-no-ecs" />
    );

  const renderNextOfKin =
    noks && noks.length ? (
      noks.map((nok, i) => (
        <Contact
          testId={`phcc-next-of-kin-${i}`}
          key={nok.id}
          index={i}
          {...nok.attributes}
        />
      ))
    ) : (
      <Instructions testId="phcc-no-nok" />
    );

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
              Call us at <HelpDeskContact testId="help-desk" />. We’re here
              24/7.
            </li>
          </ul>
        </va-additional-info>
      </div>

      <section className="profile-info-card">
        <div className="row vads-u-border-color--gray-lighter vads-u-color-gray-dark vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2 vads-u-padding-y--1p5 medium-screen:vads-u-padding--4 vads-u-border--1px">
          <h2 className="vads-u-font-family--sans vads-u-font-size--base vads-u-margin--0">
            Medical emergency contacts
          </h2>
          <p className="vads-u-color--gray-medium vads-u-margin-top--1 vads-u-margin-bottom--1">
            The people we’ll contact in an emergency.
          </p>
          {renderEmergencyContacts}
        </div>

        <div className="row vads-u-border-color--gray-lighter vads-u-color-gray-dark vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2 vads-u-padding-y--1p5 medium-screen:vads-u-padding--4 vads-u-border-left--1px vads-u-border-right--1px vads-u-border-bottom--1px">
          <h2 className="vads-u-font-family--sans vads-u-font-size--base vads-u-margin--0">
            Next of kin contacts
          </h2>
          <p className="vads-u-color--gray-medium vads-u-margin-top--1 vads-u-margin-bottom--1">
            The people you want to represent your health care wishes if needed.
          </p>
          {renderNextOfKin}
        </div>
      </section>
    </>
  );
};

Contacts.propTypes = {
  data: PropTypes.array,
};

export default Contacts;
