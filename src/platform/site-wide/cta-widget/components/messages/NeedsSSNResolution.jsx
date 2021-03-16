import React from 'react';
import CallToActionAlert from './../CallToActionAlert';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const NeedsSSNResolution = () => {
  const content = {
    heading: 'The information you provided doesn’t match our records',
    alertText: (
      <div>
        <p>
          We’re sorry. We couldn’t match the information you provided with what
          we have in our Veteran records. We take your privacy seriously, and
          we’re committed to protecting your information. We can’t give you
          access to our online health tools until we can match your information
          and verify your identity.
        </p>
        <p>
          <strong>
            We can help to try to match your information to our records and
            verify your identity:
          </strong>
        </p>
        <AdditionalInfo triggerText="Call the VA benefits hotline">
          <p>
            Please call us at <a href="tel:800-827-1000">800-827-1000</a>. We’re
            here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET. If you have
            hearing loss, call TTY:{' '}
            <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />.
          </p>
          <p>
            When the system prompts you to give a reason for your call, say,
            “eBenefits”.
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
            <li>Your Social Security number</li>
            <li>Your checking or savings account number</li>
            <li>
              The dollar amount of your most recent VA electronic funds transfer
              (EFT)
            </li>
          </ul>
        </AdditionalInfo>
        <div className="vads-u-margin-top--1p5">
          <AdditionalInfo triggerText="Or ask us a question online">
            <p>
              Ask us a question through our online help center, known as the
              Inquiry Routing & Information System (IRIS).
            </p>
            <p>
              <strong>Fill in the form fields as below:</strong>
            </p>
            <ul>
              <li>
                <strong>Question: </strong>
                Type in <strong>Not in DEERS</strong>.
              </li>
              <li>
                <strong>Topic: </strong>
                Select <strong>Veteran not in DEERS (Add)</strong>.
              </li>
              <li>
                <strong>Inquiry type: </strong> Select <strong>Question</strong>
                .
              </li>
            </ul>
            <p>
              Then, complete the rest of the form and click{' '}
              <strong>Submit</strong>.
            </p>
            <p>We’ll contact you within 2 to 3 days.</p>
            <p>
              <a
                href="https://iris.custhelp.va.gov/app/ask"
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to the IRIS website question form
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

export default NeedsSSNResolution;
