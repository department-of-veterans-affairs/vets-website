import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library';
import React from 'react';

// this is used when the user is logged in, but they are flagged in one of three ways:

// Criteria within the user state in the selector cnpDirectDepositIsBlocked
// 1. they have a !isCompetentIndicator
// 2. they have a !noFiduciaryAssignedIndicator
// 3. they have a !notDeceasedIndicator

export const AccountBlocked = () => {
  return (
    <div className="vads-u-margin-bottom--4">
      <va-alert data-testid="account-blocked-alert" status="warning">
        <h3 slot="headline">We can’t show your information</h3>
        <p>
          We’re sorry. Based on our records, we can’t show your information in
          your VA.gov profile.
        </p>
        <p className="vads-u-margin-bottom--1">
          If you think this is an error, you can call the VA.gov help desk at{' '}
          <VaTelephone contact={CONTACTS.HELP_DESK} /> (
          <VaTelephone contact={CONTACTS['711']} tty />
          ). We’re here Monday &#8211; Friday, 8 a.m. &#8211; 8 p.m. ET.
        </p>
      </va-alert>
    </div>
  );
};
