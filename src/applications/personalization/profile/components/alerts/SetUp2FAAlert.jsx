import React from 'react';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import recordEvent from '~/platform/monitoring/record-event';

const SetUp2FAAlert = () => {
  return (
    <AlertBox
      className="vads-u-margin-bottom--2"
      headline="You’ll need to verify your account to edit direct deposit information online."
      level={2}
      content={
        <>
          <p>
            We require this to help protect your bank account information and
            prevent fraud.
          </p>
          <h3 className="vads-u-font-size--h4">What you can do</h3>
          <p>
            If you have questions or concerns about your direct deposit, call us
            at <Telephone contact={CONTACTS.VA_BENEFITS} /> (TTY:{' '}
            <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
            ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
          </p>
          <p>
            You can also{' '}
            <a
              href="https://www.id.me/registration/new"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                recordEvent({ event: 'multifactor-link-clicked' });
              }}
            >
              create a verified account through ID.me
            </a>
            , and then use it to log into VA.gov and update your direct deposit
            information.
          </p>
        </>
      }
      status="continue"
      isVisible
    />
  );
};

export default SetUp2FAAlert;
