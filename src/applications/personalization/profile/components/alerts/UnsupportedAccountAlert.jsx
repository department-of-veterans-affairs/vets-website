import React from 'react';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import recordEvent from '~/platform/monitoring/record-event';
import { AUTH_EVENTS } from '~/platform/user/authentication/constants';

const UnsupportedAccountAlert = ({ isLoginGovSupported }) => {
  let content;
  if (isLoginGovSupported) {
    content = (
      <AlertBox
        className="vads-u-margin-bottom--2"
        headline="You’ll need to verify your identity with Login.gov or ID.me to update your direct deposit information online."
        level={2}
        content={
          <>
            <p>
              We require this to protect your bank account information and
              prevent fraud.
            </p>
            <p>
              <strong>
                Get help updating your direct deposit information.
              </strong>{' '}
              You can call us at <Telephone contact={CONTACTS.VA_BENEFITS} />{' '}
              (TTY:{' '}
              <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
              ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
            </p>
            <p>
              <strong>
                Sign in with a verified ID.me or Login.gov account.
              </strong>{' '}
              You can create a verified account on{' '}
              <a
                href="https://secure.login.gov/sign_up/enter_email"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  recordEvent({ event: AUTH_EVENTS.MFA });
                }}
              >
                Login.gov
              </a>{' '}
              or{' '}
              <a
                href="https://www.id.me/registration/new"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  recordEvent({ event: AUTH_EVENTS.MFA });
                }}
              >
                ID.me
              </a>
              . Or, if you already have one, please sign out and sign back in
              using your existing verified account. Then you can update your
              direct deposit information online.
            </p>
          </>
        }
        status="continue"
        isVisible
      />
    );
  } else {
    content = (
      <AlertBox
        className="vads-u-margin-bottom--2"
        headline="You’ll need to verify your identity with ID.me to update any of your direct deposit information online"
        level={2}
        content={
          <>
            <p>
              We require this to protect your bank account information and
              prevent fraud.
            </p>
            <p>
              <strong>
                Get help updating your direct deposit information.
              </strong>{' '}
              You can call us at <Telephone contact={CONTACTS.VA_BENEFITS} />{' '}
              (TTY:{' '}
              <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
              ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
            </p>
            <p>
              <strong>Sign in with a verified ID.me account.</strong>
              You can{' '}
              <a
                href="https://www.id.me/registration/new"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  recordEvent({ event: AUTH_EVENTS.MFA });
                }}
              >
                create a verified account on ID.me
              </a>
              . Or, if you already have one, please sign out and sign back in
              using your existing verified ID.me account. Then you’ll be able to
              update your direct deposit information online.
            </p>
          </>
        }
        status="continue"
        isVisible
      />
    );
  }
  return content;
};

export default UnsupportedAccountAlert;
