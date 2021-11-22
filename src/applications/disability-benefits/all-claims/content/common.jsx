import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export const editNote = name => (
  <p>
    <strong>Note:</strong> If you need to update your {name}, please call
    Veterans Benefits Assistance at <Telephone contact={CONTACTS.VA_BENEFITS} />
    , Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
  </p>
);

export const ContactCrisis = () => (
  <>
    <p>
      If you’re in crisis, we can support you. Our Veterans Crisis Line is
      confidential (private), free, and available 24/7.
    </p>
    <p>
      To connect with a Veterans Crisis Line responder anytime, day or night:
    </p>
    <ul>
      <li>
        Call the Veterans Crisis Line at{' '}
        <Telephone contact={CONTACTS.CRISIS_LINE} /> and press 1,{' '}
        <strong>or</strong>
      </li>
      <li>
        Visit{' '}
        <a href="https://www.veteranscrisisline.net/ChatTermsOfService.aspx?account=Veterans%20Chat/">
          Veterans Crisis Line
        </a>{' '}
        to start a confidential chat online, <strong>or</strong>
      </li>
      <li>
        Send a text message to <a href="sms:838255">838255</a>.
      </li>
    </ul>
    <p>
      If you have hearing loss, please call TTY at{' '}
      <Telephone contact={CONTACTS.CRISIS_TTY} />.
    </p>
  </>
);
