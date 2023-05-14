import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import CallToActionAlert from '../CallToActionAlert';

const MultipleIds = () => {
  const content = {
    heading: 'It looks like you have more than one My HealtheVet account',
    alertText: (
      <div>
        <p>We’re sorry. We found more than one active account for you.</p>
        <p>
          <strong>You can fix this issue in one of these ways: </strong>
        </p>
        <va-additional-info trigger="Call the My HealtheVet help desk">
          <p>
            Call us at <va-telephone contact="8773270022" />. We’re here Monday
            through Friday, 8:00 a.m. to 8:00 p.m. ET. If you have hearing loss,
            call <va-telephone contact={CONTACTS.HELP_TTY} tty />.
          </p>
          <p>
            Tell the representative that you tried to sign in to use the health
            tools on VA.gov, but received an error message telling you that you
            have more than one My HealtheVet account.
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
                  received an error message telling me I have more than one
                  MyHealtheVet account.”
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

export default MultipleIds;
