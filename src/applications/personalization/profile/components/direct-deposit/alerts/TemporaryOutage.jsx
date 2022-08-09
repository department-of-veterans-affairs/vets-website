import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const TemporaryOutage = () => (
  <div className="vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--4">
    <va-alert
      close-btn-aria-label="Close notification"
      status="warning"
      visible
    >
      <h2 slot="headline">Direct deposit isn’t available right now</h2>
      <>
        <p>
          We’re sorry. Direct deposit isn’t available right now. We’re working
          to fix the issue as soon as possible. Please check back after 5 p.m.
          ET, Monday, August 16 for an update.
        </p>
        <h4>What you can do</h4>
        <p>
          If you have questions or concerns related to your direct deposit, call
          us at{' '}
          <a
            href="tel:1-800-827-1000"
            aria-label="800. 8 2 7. 1000."
            title="Dial the telephone number 800-827-1000"
            className="no-wrap"
          >
            800-827-1000
          </a>{' '}
          (TTY:{' '}
          <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
          ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET. Or go
          to your{' '}
          <a href="/find-locations/?facilityType=benefits">
            nearest VA regional office
          </a>
          .
        </p>
      </>
    </va-alert>
  </div>
);

export default TemporaryOutage;
