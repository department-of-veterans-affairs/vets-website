import React from 'react';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import recordEvent from '~/platform/monitoring/record-event';
import { AUTH_EVENTS } from '~/platform/user/authentication/constants';

const UnsupportedAccountAlert = () => {
  return (
    <AlertBox
      className="vads-u-margin-bottom--2"
      headline="You’ll need to verify your identity with Login.gov or ID.me to update your direct deposit information online."
      level={2}
      content={
        <>
          <p>
            We require this to protect your bank account information and prevent
            fraud. If you have a verified Login.gov or ID.me account, you can
            sign out and sign back in with that account. Then you can update
            your direct deposit information online. If you don’t have one of
            these accounts, you can create one now.
          </p>
          <p>
            <a
              href="https://secure.login.gov/sign_up/enter_email"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                recordEvent({ event: AUTH_EVENTS.MFA });
              }}
            >
              Create a Login.gov account
            </a>
          </p>
          <p>
            <a
              href="https://www.id.me/registration/new"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                recordEvent({ event: AUTH_EVENTS.MFA });
              }}
            >
              Create an ID.me account
            </a>
          </p>
          <p>
            <strong>Note: </strong> If you need help updating your direct
            deposit information, call us at{' '}
            <Telephone contact={CONTACTS.VA_BENEFITS} /> (TTY:{' '}
            <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
            ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
          </p>
        </>
      }
      status="continue"
      isVisible
    />
  );
};

export default UnsupportedAccountAlert;
