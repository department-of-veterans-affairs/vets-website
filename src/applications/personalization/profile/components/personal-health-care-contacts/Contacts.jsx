import React from 'react';
import PropTypes from 'prop-types';

import { ProfileInfoCard } from '@@profile/components/ProfileInfoCard';

import Contact from './Contact';
import HelpDeskContact from './HelpDeskContact';
import Instructions from './Instructions';

const Contacts = ({ data }) => {
  const ecs = data.filter(el => el.id.match(/emergency contact/i));
  const noks = data.filter(el => el.id.match(/next of kin/i));

  const renderEmergencyContacts =
    ecs && ecs.length ? (
      ecs.map((ec, i) => ({
        value: (
          <>
            <Contact
              testId={`phcc-emergency-contact-${i}`}
              key={ec.id}
              index={i}
              numberOfContacts={ecs.length}
              {...ec.attributes}
            />
          </>
        ),
      }))
    ) : (
      <Instructions testId="phcc-no-ecs" />
    );

  const renderNextOfKin =
    noks && noks.length ? (
      noks.map((nok, i) => ({
        value: (
          <>
            <Contact
              testId={`phcc-next-of-kin-${i}`}
              key={nok.id}
              index={i}
              numberOfContacts={noks.length}
              {...nok.attributes}
            />
          </>
        ),
      }))
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

      <ProfileInfoCard
        title="Emergency contacts"
        data={renderEmergencyContacts}
        namedAnchor="emergency-contacts"
        level={2}
      />

      <ProfileInfoCard
        title="Next of kin contacts"
        data={renderNextOfKin}
        namedAnchor="next-of-kin-contacts"
        className="vads-u-margin-top--4"
        level={2}
      />
    </>
  );
};

Contacts.propTypes = {
  data: PropTypes.array,
};

export default Contacts;
