import React from 'react';
import PropTypes from 'prop-types';
import { ProfileInfoSection } from '@@profile/components/ProfileInfoSection';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { Toggler } from '~/platform/utilities/feature-toggles';
import Contact from './Contact';
import Instructions from './Instructions';
import { CONTACT_TYPE_DESCRIPTIONS, CONTACT_TYPE_UI_NAMES } from './constants';

const Contacts = ({ data }) => {
  const ecs = data.filter(el => el.id.match(/emergency contact/i));
  const noks = data.filter(el => el.id.match(/next of kin/i));

  const renderEmergencyContacts = ecs?.length ? (
    ecs.map((ec, i) => ({
      value: (
        <Contact
          testId={`phcc-emergency-contact-${i}`}
          key={ec.id}
          index={i}
          numberOfContacts={ecs.length}
          {...ec.attributes}
        />
      ),
    }))
  ) : (
    <Instructions
      testId="phcc-no-ecs"
      contactType={CONTACT_TYPE_UI_NAMES.EMERGENCY_CONTACT}
      description={CONTACT_TYPE_DESCRIPTIONS.EMERGENCY_CONTACT}
    />
  );

  const renderNextOfKin = noks?.length ? (
    noks.map((nok, i) => ({
      value: (
        <Contact
          testId={`phcc-next-of-kin-${i}`}
          key={nok.id}
          index={i}
          numberOfContacts={noks.length}
          {...nok.attributes}
        />
      ),
    }))
  ) : (
    <Instructions
      testId="phcc-no-nok"
      contactType={CONTACT_TYPE_UI_NAMES.NEXT_OF_KIN}
      description={CONTACT_TYPE_DESCRIPTIONS.NEXT_OF_KIN}
    />
  );

  const UpdateInstructions = () => (
    <p>
      To update this information, call us at{' '}
      <VaTelephone contact={CONTACTS['222_VETS']} /> (
      <VaTelephone contact={CONTACTS['711']} tty />
      ). We’re available Monday through Friday, 8:00 a.m. to 8:00 p.m. ET. Or
      ask a staff member at your next appointment.
    </p>
  );

  return (
    <>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.profile2Enabled}>
        <Toggler.Enabled>
          <va-additional-info trigger="Learn how to update your personal health care information">
            <UpdateInstructions />
          </va-additional-info>
        </Toggler.Enabled>
        <Toggler.Disabled>
          <UpdateInstructions />
        </Toggler.Disabled>
      </Toggler>

      <ProfileInfoSection
        title="Emergency contacts"
        data={renderEmergencyContacts}
        namedAnchor="emergency-contacts"
        level={2}
        className="vads-u-margin-top--4"
      />

      <ProfileInfoSection
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
