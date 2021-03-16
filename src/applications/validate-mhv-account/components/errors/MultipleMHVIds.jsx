import React from 'react';
import CollapsiblePanel from '@department-of-veterans-affairs/component-library/CollapsiblePanel';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import MessageTemplate from '../MessageTemplate';

const MultipleMHVIds = () => {
  const content = {
    heading: 'It looks like you have more than one My HealtheVet account',
    alertContent: (
      <p>We’re sorry. We found more than one active account for you.</p>
    ),
    alertStatus: 'error',
    body: (
      <>
        <h5>What you can do</h5>
        <p>You can call My HealtheVet or submit an online request for help.</p>

        <CollapsiblePanel
          panelName="Call the My HealtheVet help desk"
          borderless
        >
          <p>
            Call the My HealtheVet help desk at{' '}
            <a href="tel:877-327-0022">877-327-0022</a>. We’re here Monday
            through Friday, 8:00 a.m. to 8:00 p.m. ET. If you have hearing loss,
            call TTY: <Telephone contact={CONTACTS.HELP_TTY} />.
          </p>
          <p>
            Tell the representative that you tried to sign in to use health
            tools on VA.gov, but received an error message telling you that you
            have more than one My HealtheVet account.
          </p>
        </CollapsiblePanel>

        <CollapsiblePanel
          panelName="Submit an online help request to My HealtheVet"
          borderless
        >
          <p>
            Use the My HealtheVet contact form to submit an online request for
            help.
          </p>
          <p>
            <strong>Fill in the form fields as below:</strong>
          </p>
          <ul>
            <li>
              <strong>Topic:</strong> Select <strong>Account Login</strong>.
            </li>
            <li>
              <strong>Category:</strong> Select{' '}
              <strong>Request for Assistance</strong>.
            </li>
            <li>
              <strong>Comments:</strong> Type, or copy and paste, in the message
              below:
              <p>
                “When I tried to sign in to use health tools on VA.gov, I
                received an error message telling me I have more than one
                MyHealtheVet account.”
              </p>
            </li>
          </ul>
          <p>
            Then, complete the rest of the form and click{' '}
            <strong>Submit</strong>
          </p>
          <a href="https://www.myhealth.va.gov/mhv-portal-web/contact-us">
            Go to the My HealtheVet contact form
          </a>
        </CollapsiblePanel>
      </>
    ),
  };

  return <MessageTemplate content={content} />;
};

export default MultipleMHVIds;
