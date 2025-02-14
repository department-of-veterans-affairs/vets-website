import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import CallToActionAlert from '../CallToActionAlert';

const DeactivatedMHVIds = () => {
  const content = {
    heading: 'Your My HealtheVet account is inactive',
    alertText: (
      <div>
        <p>
          We’re sorry. Your My HealtheVet account isn’t active at this time. To
          use our online health tools, you’ll need to contact us to reactivate
          your account.
        </p>
        <p>
          <strong>You can reactivate your account in one of these ways:</strong>
        </p>
        <va-additional-info trigger="Call the My HealtheVet help desk">
          <p>
            Call us at <va-telephone contact="8773270022" />. We’re here Monday
            through Friday, 8:00 a.m. to 8:00 p.m. ET. If you have hearing loss,
            call <va-telephone contact={CONTACTS.HELP_TTY} tty />.
          </p>
          <p>
            Tell the representative that you tried to sign in to use the health
            tools on VA.gov, but received an error message telling you that your
            My HealtheVet account isn’t active.
          </p>
        </va-additional-info>
        <div className="vads-u-margin-top--1p5">
          <va-additional-info trigger="Or submit an online help request to My HealtheVet">
            <p>
              Use the My HealtheVet contact form to submit an online request for
              help online.
            </p>
            <p>
              <strong>Fill in the form fields as below:</strong>
            </p>
            <ul>
              <li>
                <strong>Topic: </strong>
                Select <strong>Account Login</strong>.
              </li>
              <li>
                <strong>Category: </strong>
                Select <strong>Request for Assistance</strong>.
              </li>
              <li>
                <strong>Comments: </strong> Type, or copy and paste, the message
                below:
                <p>
                  “When I tried to sign in to use the health tools on VA.gov, I
                  received an error message telling me that my My HealtheVet
                  account isn’t active.”
                </p>
              </li>
            </ul>
            <p>
              Then, complete the rest of the form and click{' '}
              <strong>Submit</strong>.
            </p>
            <p>
              <a
                href="https://www.myhealth.va.gov/mhv-portal-web/contact-us"
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to the My HealtheVet contact form
              </a>
            </p>
          </va-additional-info>
        </div>
      </div>
    ),
    status: 'error',
  };

  return <CallToActionAlert {...content} />;
};

export default DeactivatedMHVIds;
