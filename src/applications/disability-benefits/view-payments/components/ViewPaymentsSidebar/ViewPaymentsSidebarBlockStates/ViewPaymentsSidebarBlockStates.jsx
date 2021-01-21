import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export const firstSidebarBlock = {
  heading: 'What if I need to change my direct deposit or contact information?',
  content: (
    <>
      <p>
        Any changes you make in your profile will update across your disability
        compensation, pension, claims and appeal, VR&E, and VA health care
        benefits.
      </p>
      <p>
        <a href="/profile">
          Go to your profile to make updates to your contact and direct deposit
          information.
        </a>
      </p>
    </>
  ),
};

export const secondSidebarBlock = {
  heading: 'What if I’m missing a payment?',
  content: (
    <>
      <p>
        Please wait 3 business days (Monday through Friday) before contacting us
        to report that you haven’t received a payment. We can’t trace payments
        before then.
      </p>
      <p>
        {' '}
        To report a missing payment, contact us at{' '}
        <Telephone contact={CONTACTS.VA_BENEFITS} />. Please have the following
        information ready for the call: your address, Social Security number or
        VA claim number. If you receive payments through direct deposit, you’ll
        need your bank account information too.
      </p>
    </>
  ),
};

export const thirdSidebarBlock = {
  heading: 'What if I have questions?',
  content: (
    <>
      <p>
        You can call us at{' '}
        <a href="tel:8008271000" aria-label="1. 800. 827. 1000.">
          800-827-1000
        </a>
        . We're here Monday through Friday, 8:00 a.m. to 9:00 p.m. E.T.
      </p>
    </>
  ),
};
