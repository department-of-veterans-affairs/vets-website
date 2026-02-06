import React from 'react';

export const directDepositSetupInfo = (
  <div>
    <p className="vads-u-margin-top--0">
      The Foreign Medical Program uses a different system for direct deposit
      than other VA benefits use. If you don’t have an account with the
      Financial Services Center, you’ll need to create one through the Customer
      Engagement Portal to receive your reimbursement.
    </p>
    <p>
      <va-link
        text="Learn how to set up direct deposit for FMP claims"
        href="http://preview-prod.vfs.va.gov/preview?nodeId=85191"
      />
    </p>
    <p className="vads-u-margin-bottom--0">
      <strong>
        For help setting up direct deposit in the Customer Engagement Portal
      </strong>
      , you can call the Financial Services Center Customer Support Help Desk at{' '}
      <va-telephone contact="8773539791" />.
    </p>
  </div>
);

const PaymentSelectionDescription = () => (
  <>
    <p>
      Tell us if we should send any payments for this claim to you or to the
      provider:
    </p>
    <ul>
      <li>
        <strong>If you already paid the provider,</strong> select{' '}
        <strong>Veteran</strong>. If we approve your claim, we’ll pay you by
        direct deposit if you have it set up.
      </li>
      <li>
        <strong>If you haven’t paid the provider,</strong> select{' '}
        <strong>Provider</strong>. We’ll send a check to the provider by mail.
      </li>
    </ul>
    <va-additional-info
      trigger="What to know about setting up direct deposit for FMP claims"
      class="vads-u-margin-y--4"
    >
      {directDepositSetupInfo}
    </va-additional-info>
  </>
);

export default PaymentSelectionDescription;
