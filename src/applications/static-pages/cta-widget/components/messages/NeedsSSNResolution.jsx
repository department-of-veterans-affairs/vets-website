import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import CallToActionAlert from '../CallToActionAlert';

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
        <va-additional-info trigger="Call the VA benefits hotline">
          <p>
            Please call us at <va-telephone contact="8008271000" />. We’re here
            Monday through Friday, 8:00 a.m. to 9:00 p.m. ET. If you have
            hearing loss, call <va-telephone contact={CONTACTS['711']} tty />.
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
        </va-additional-info>
        <div className="vads-u-margin-top--1p5">
          <va-additional-info trigger="Or ask us a question online">
            <p>Ask us a question online.</p>
            <p>
              <a href="/contact-us/">Contact us online through Ask VA</a>
            </p>
          </va-additional-info>
        </div>
      </div>
    ),
    status: 'error',
  };

  return <CallToActionAlert {...content} />;
};

export default NeedsSSNResolution;
