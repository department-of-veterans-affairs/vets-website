import React from 'react';
import MessageTemplate from '../MessageTemplate';

const CreateAccountFailed = () => {
  const content = {
    heading: 'We couldn’t create a My HealtheVet account for you',
    alertContent: (
      <div>
        <p>
          We’re sorry. Something went wrong on our end, and we couldn’t create a
          My HealtheVet account for you. You’ll need a My HealtheVet account to
          access health tools on VA.gov.
        </p>
      </div>
    ),
    alertStatus: 'error',
    body: (
      <>
        <h5>What you can do</h5>
        <p>
          To create an account, please call the My HealtheVet help desk or
          submit an online request for help.
        </p>
        <ul className="usa-accordion">
          <li>
            <button
              className="usa-accordion-button"
              aria-expanded="false"
              aria-controls="a1"
            >
              Call the My HealtheVet help desk
            </button>
            <div id="a1" className="usa-accordion-content">
              <p>
                Call the My HealtheVet help desk at{' '}
                <a href="tel:877-327-0022">77-327-0022</a>
                8. We're here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
                If you have hearing loss, call TTY: 800-877-3399.
              </p>
              <p>
                Tell the representative that you tried to sign in to use health
                tools on VA.gov, but received an error message telling you that
                we couldn't create an account for you.
              </p>
            </div>
          </li>
          <li>
            <button
              className="usa-accordion-button"
              aria-expanded="false"
              aria-controls="a2"
            >
              Submit an online help request to My HealtheVet
            </button>
            <div id="a2" className="usa-accordion-content">
              <p>
                Use the My HealtheVet contact form to submit an online request
                for help.
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
                  <strong>Comments:</strong> Type, or copy and paste, in the
                  message below:
                  <p>
                    “When I tried to sign in to use health tools on VA.gov, I
                    received an error message telling me that the site couldn't
                    create a My HealtheVet account for me.”
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
            </div>
          </li>
        </ul>
      </>
    ),
  };

  return <MessageTemplate content={content} />;
};

export default CreateAccountFailed;
