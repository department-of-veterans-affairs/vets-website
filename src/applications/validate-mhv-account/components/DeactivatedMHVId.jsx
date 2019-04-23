import React from 'react';
import MessageTemplate from './MessageTemplate';

const DeactivatedMHVId = () => {
  const content = {
    heading: 'Please contact us to reactivate your account',
    alertContent: (
      <>
        <p>
          We’re sorry. Your My HealtheVet account isn’t active at this time. To
          use our online health tools, you’ll need to call us to reactivate your
          account.
        </p>
      </>
    ),
    alertStatus: 'error',
    body: (
      <>
        <h5>What you can do</h5>
        <p>
          Call My HealtheVet help desk or submit an online request for help.
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
                Ask us a question online through our online help center, known
                as the Inquiry Routing &amp; Information System (or IRIS).
              </p>
              <p>
                <strong>Fill in the form fields as below:</strong>
              </p>
              <ul>
                <li>
                  <strong>Question:</strong> Type in “Not in DEERS.”
                </li>
                <li>
                  <strong>Topic:</strong> Select “Veteran not in DEERS (Add)”
                </li>
                <li>
                  <strong>Inquiry type:</strong> Select “Question”
                </li>
              </ul>
              <p>
                Then, complete the rest of the form and click{' '}
                <strong>Submit</strong>
              </p>
              <p>We’ll contact you within 2 to 3 days.</p>
              <a href="https://iris.custhelp.va.gov/app/as">
                Go to the IRIS website question form
              </a>
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
                Ask us a question online through our online help center, known
                as the Inquiry Routing &amp; Information System (or IRIS).
              </p>
              <p>
                <strong>Fill in the form fields as below:</strong>
              </p>
              <ul>
                <li>
                  <strong>Question:</strong> Type in “Not in DEERS.”
                </li>
                <li>
                  <strong>Topic:</strong> Select “Veteran not in DEERS (Add)”
                </li>
                <li>
                  <strong>Inquiry type:</strong> Select “Question”
                </li>
              </ul>
              <p>
                Then, complete the rest of the form and click{' '}
                <strong>Submit</strong>
              </p>
              <p>We’ll contact you within 2 to 3 days.</p>
              <a href="https://iris.custhelp.va.gov/app/as">
                Go to the IRIS website question form
              </a>
            </div>
          </li>
        </ul>
      </>
    ),
  };

  return <MessageTemplate content={content} />;
};

export default DeactivatedMHVId;
