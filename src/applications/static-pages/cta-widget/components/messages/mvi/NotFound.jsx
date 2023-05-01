import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import CallToActionAlert from '../../CallToActionAlert';

const NotFound = () => {
  const content = {
    heading: 'We couldn’t verify your identity',
    alertText: (
      <div>
        <p>
          We’re sorry. We couldn’t match the information you provided with what
          we have in our Veteran records. We take your privacy seriously, and
          we’re committed to protecting your information. We can’t give you
          access to our online health tools until we can match your information
          and verify your identity.
        </p>
        <p>You can verify your identity in one of these 2 ways:</p>
        <h5>Call the VA benefits hotline</h5>
        <p>
          Please call us at <va-telephone contact="8008271000" />. We’re here
          Monday through Friday, 8:00 a.m. to 9:00 p.m. ET. If you have hearing
          loss, call <va-telephone contact={CONTACTS['711']} tty />.
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
        <h5>Or ask us a question online</h5>
        <p>
          You can contact us through Ask VA, our service for asking questions
          online.
        </p>
        <p>
          <a href="/contact-us/">Contact us online through Ask VA</a>
        </p>
      </div>
    ),
    status: 'error',
  };

  return <CallToActionAlert {...content} />;
};

export default NotFound;
