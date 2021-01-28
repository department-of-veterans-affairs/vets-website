import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import { links } from 'applications/caregivers/definitions/content';

const NeedHelpFooter = () => {
  return (
    <>
      <p>
        You can call the VA Caregiver Support Line at
        <Telephone
          contact={CONTACTS.CAREGIVER}
          className="vads-u-margin-left--0p5"
        />
        . We’re here Monday through Friday, 8:00 a.m. to 10:00 p.m. ET, and
        Saturday, 8:00 a.m. to 5:00 p.m. ET.
      </p>

      <p>
        You can also call our main VA information line at
        <Telephone
          contact={CONTACTS.HEALTHCARE_ELIGIBILITY_CENTER}
          className="vads-u-margin-x--0p5"
        />
        if you have questions about completing your application, or you can
        contact your local Caregiver Support Coordinator.
      </p>

      <span>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={links.caregiverSupportCoordinators.link}
          className="vads-u-margin-right--0p5"
        >
          Use our online Caregiver Support Coordinator search tool
        </a>
      </span>

      <p>
        If this form isn't working right for you, please call us at
        <Telephone
          contact={CONTACTS.HELP_DESK}
          className="vads-u-margin-left--0p5"
        />
        .<br />
        <span>
          If you have hearing loss, call TTY:
          <Telephone
            className="vads-u-margin-left--0p5"
            contact={CONTACTS['711']}
            pattern={PATTERNS['911']}
          />
          .
        </span>
      </p>
    </>
  );
};

export default NeedHelpFooter;
