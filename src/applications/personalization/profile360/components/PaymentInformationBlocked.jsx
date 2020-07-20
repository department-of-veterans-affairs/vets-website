import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function PaymentInformationBlocked() {
  return (
    <AlertBox
      isVisible
      status="error"
      headline="You can’t update your financial information"
      className="vads-u-margin-top--0 vads-u-margin-bottom--3"
    >
      <p>
        We’re sorry. Our records show that you’re unable to view and update your
        financial information from your VA.gov profile.
      </p>
      <p>
        If you think this is an error, you can call the VA.gov help desk at{' '}
        <a
          href="tel:1-855-574-7286"
          aria-label="8 5 5. 5 7 4. 7 2 8 6."
          title="Dial the telephone number 855-574-7286"
          className="no-wrap"
        >
          855-574-7286
        </a>{' '}
        (
        <a href="tel:711" aria-label="TTY. 7 1 1.">
          TTY: 711
        </a>
        ). We’re here Monday &#8211; Friday, 8 a.m. &#8211; 8 p.m. ET.
      </p>
    </AlertBox>
  );
}
