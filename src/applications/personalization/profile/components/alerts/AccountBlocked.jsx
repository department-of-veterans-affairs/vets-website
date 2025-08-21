import { CONTACTS } from '@department-of-veterans-affairs/component-library';
import React from 'react';

import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// this is used when the user is logged in, but they are flagged in one of three ways:

// Criteria within the user state in the selector cnpDirectDepositIsBlocked
// 1. they have a !isCompetentIndicator
// 2. they have a !noFiduciaryAssignedIndicator
// 3. they have a !notDeceasedIndicator

const AccountBlocked = ({ recordCustomProfileEvent }) => {
  const recordView = () => {
    recordCustomProfileEvent({
      status: 'Fiduciary Flag Views',
      title: `We can't show your information`,
    });
  };

  return (
    <div className="vads-u-margin-bottom--4">
      <VaAlert
        data-testid="account-blocked-alert"
        status="warning"
        onVa-component-did-load={recordView}
        uswds
      >
        <h2 slot="headline">We can’t show your information</h2>
        <p>
          We’re sorry. Based on our records, we can’t show your information in
          your VA.gov profile.
        </p>
        <p className="vads-u-margin-bottom--1">
          If you think this is an error, you can call the VA.gov help desk at{' '}
          <va-telephone contact={CONTACTS.HELP_DESK} /> (
          <va-telephone contact={CONTACTS['711']} tty />
          ). We’re here Monday &#8211; Friday, 8 a.m. &#8211; 8 p.m. ET.
        </p>
      </VaAlert>
    </div>
  );
};

AccountBlocked.propTypes = {
  recordCustomProfileEvent: PropTypes.func.isRequired,
};

export { AccountBlocked };
