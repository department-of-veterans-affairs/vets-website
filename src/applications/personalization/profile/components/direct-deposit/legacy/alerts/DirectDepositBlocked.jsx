import React from 'react';

export default function DirectDepositBlocked() {
  return (
    <va-alert status="warning" visible uswds>
      <h2
        slot="headline"
        className="vads-u-font-size--base vads-u-font-family--sans"
        data-testid="direct-deposit-blocked"
      >
        We can’t show your financial information
      </h2>
      <p>
        We’re sorry. Based on our records, we can't show your financial
        information in your VA.gov profile.
      </p>
      <p className="vads-u-margin-bottom--0">
        If you think this is an error, you can call the VA.gov help desk at{' '}
        <va-telephone contact="8555747286" /> (
        <va-telephone tty contact="711" />
        ). We're here Monday - Friday, 8 a.m. - 8 p.m. ET.
      </p>
    </va-alert>
  );
}
