import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/formation-react/Telephone';
import { links } from 'applications/caregivers/definitions/content';

const NeedHelpFooter = props => {
  const isConfirmationPage = props.currentLocation.pathname === '/confirmation';

  const FormFooter = () => (
    <footer className="caregiver-footer row vads-u-padding-x--1p5">
      <div style={{ maxWidth: '600px' }}>
        <h2 className="vads-u-font-size--h5">Need help?</h2>
        <hr />
        <p>
          You can call the VA Caregiver Support Line at
          <Telephone
            contact={CONTACTS.CAREGIVER}
            className="vads-u-margin-left--0p5"
          />
          . We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>

        <p>
          You can also call our main VA information line at
          <Telephone
            contact={CONTACTS['222_VETS']}
            className="vads-u-margin-left--0p5"
          />
          , or contact your local Caregiver Support Coordinator.
        </p>

        <span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={links.caregiverSupportCoordinators.link}
            className="vads-u-margin-x--0p5"
          >
            Use our online Caregiver Support Coordinator search tool
          </a>
        </span>

        <p>
          If this form isn't working right for you, please call us at at
          <Telephone
            contact={CONTACTS.HELP_DESK}
            className="vads-u-margin-left--0p5"
          />
          .<br />
          <span>
            If you have hearing loss, call{' '}
            <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />.
          </span>
        </p>
      </div>
    </footer>
  );

  const ConfirmationFooter = () => (
    <footer className="caregiver-footer row vads-u-padding-x--1p5">
      <div style={{ maxWidth: '600px' }}>
        <h2>What happens after I apply?</h2>

        <p>
          If we need you to provide more information or documents, we will
          contact you. A member of the Caregiver Support Program team at the
          medical center where the Veteran plans to receive care will contact
          you to discuss the application process and next steps in determining
          eligibility. If you aren’t eligible for PCAFC you may be eligible for
          the Program of General Caregiver Support Services (PGCSS).
        </p>

        <p>
          If you have questions about your application, what to expect next, or
          if you are interested in learning more about the supports and services
          available to support Veterans and caregivers, you may contact the VA
          Caregiver Support Line at 855-260-3274 or visit www.va.caregiver.gov.
        </p>
      </div>
    </footer>
  );

  return isConfirmationPage ? <ConfirmationFooter /> : <FormFooter />;
};

export default NeedHelpFooter;
