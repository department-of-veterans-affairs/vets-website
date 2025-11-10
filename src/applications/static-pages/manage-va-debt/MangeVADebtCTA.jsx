import React from 'react';
import { getAppUrl } from 'platform/utilities/registry-helpers';

const cdpUrl = getAppUrl('combined-debt-portal');
const fsrUrl = getAppUrl('request-debt-help-form-5655');
const disputeUrl = getAppUrl('dispute-debt');
const breadcrumbs = [
  { href: '/', label: 'Home' },
  { href: '/manage-va-debt', label: 'Manage your VA debt' },
];
const bcString = JSON.stringify(breadcrumbs);

const ManageVADebtCTA = () => (
  <>
    <va-breadcrumbs breadcrumb-list={bcString} />
    {/* This page is only for local development purposes, on staging/prod
     this page is rendered from the content-build in drupal. */}
    <h1>Manage your VA debt for benefit overpayments and copay bills</h1>
    <p>
      Review your current VA benefit debt or copay bill balances online. And
      find out how to make payments or request help now.
    </p>
    <h2>Review overpayments and copay bills online</h2>
    <p>
      <va-link-action href={cdpUrl} type="primary" text="Manage your VA debt" />
    </p>
    <hr />
    <h2>Request help with VA debt (VA Form 5655)</h2>
    <p>
      <va-link-action
        href={fsrUrl}
        type="primary"
        text="Request help with VA debt"
      />
    </p>
    <hr />
    <h2>Dispute your overpayment</h2>
    <p>
      <va-link-action
        href={disputeUrl}
        type="primary"
        text="Dispute your overpayment"
      />
    </p>
  </>
);

export default ManageVADebtCTA;
