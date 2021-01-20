import React from 'react';
import CallToActionAlert from '../CallToActionAlert';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const MultipleIds = () => {
  const content = {
    heading: 'It looks like you have more than one My HealtheVet account',
    alertText: (
      <div>
        <p>We’re sorry. We found more than one active account for you.</p>
        <p>
          <strong>You can fix this issue in one of these ways: </strong>
        </p>
        <AdditionalInfo triggerText="Call the My HealtheVet help desk">
          <p>
            Call us at <a href="tel:877-327-0022">877-327-0022</a>. We’re here
            Monday through Friday, 8:00 a.m. to 8:00 p.m. ET. If you have
            hearing loss, call TTY: <Telephone contact={CONTACTS.HELP_TTY} />.
          </p>
          <p>
            Tell the representative that you tried to sign in to use the health
            tools on VA.gov, but received an error message telling you that you
            have more than one My HealtheVet account.
          </p>
        </AdditionalInfo>
        <div className="vads-u-margin-top--1p5">
          <AdditionalInfo triggerText="Or submit an online help request to My HealtheVet">
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
          </AdditionalInfo>
        </div>
      </div>
    ),
    status: 'error',
  };

  return <CallToActionAlert {...content} />;
};

export default MultipleIds;
