import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const ZeroDebtsCopaysSection = () => {
  return (
    <>
      <h2>You don’t have any current VA debt or copay bills</h2>
      <p>
        Our records show you don’t have any current VA benefit debt and you
        haven’t received a copay bill in the past 6 months.
      </p>
      <h3>What to do if you think you have a VA debt or copay bill</h3>
      <div>
        <p>
          For benefit debts, call the Debt Management Center (DMC) at{' '}
          <va-telephone contact={CONTACTS.DMC} /> (
          <va-telephone tty contact="711" />
          ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
        </p>
        <p>
          For medical copay bills, call the VA Health Resource Center at{' '}
          <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} /> (
          <va-telephone contact={CONTACTS[711]} tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>{' '}
        <va-link
          active
          class="vads-u-margin-top--2"
          data-testid="return-to-va-link"
          href="https://va.gov"
          text="Return to VA.gov"
        />
      </div>
    </>
  );
};
export default ZeroDebtsCopaysSection;
