import React from 'react';
import CollapsiblePanel from '@department-of-veterans-affairs/formation-react/CollapsiblePanel';
import MessageTemplate from '../MessageTemplate';

const VerificationFailed = () => {
  const content = {
    heading: 'Please contact us to verify your identity.',
    alertContent: (
      <div>
        <p>
          We’re sorry. We can’t match the information you provided with what we
          have in our Veteran records. We take your privacy seriously, and we’re
          committed to protecting your information. We can’t give you access to
          our online health tools until we can match your information and verify
          your identity.
        </p>
      </div>
    ),
    alertStatus: 'error',
    body: (
      <>
        <h5>What you can do</h5>
        <p>
          To verify your identity, please call us or submit an online help
          request.
        </p>

        <CollapsiblePanel panelName="Call us" borderless>
          <p>
            Please call us at <a href="tel:800-827-1000">800-827-1000</a>. We’re
            here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET. If you have
            hearing loss, call TTY: 711.
          </p>
          <p>
            When the system prompts you to give a reason for your call, say,
            “eBenefits.”
          </p>
          <p>
            <strong>We’ll then ask you to tell us:</strong>
          </p>
          <ul>
            <li>
              Your full name. Please provide the last name you used while in
              service or that’s listed on your DD214 or other separation
              documents, even if you’ve since changed your name.
            </li>
            <li>Your Social Security Number</li>
            <li>Your checking or savings account number</li>
            <li>
              The dollar amount of your most recent VA electronic funds transfer
              (EFT)
            </li>
          </ul>
        </CollapsiblePanel>

        <CollapsiblePanel panelName="Ask us a question online" borderless>
          <p>
            Ask us a question online through our online help center, known as
            the Inquiry Routing &amp; Information System (or IRIS).
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
          <a
            href="https://iris.custhelp.va.gov/app/ask"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to the IRIS website question form
          </a>
        </CollapsiblePanel>
      </>
    ),
  };

  return <MessageTemplate content={content} />;
};

export default VerificationFailed;
