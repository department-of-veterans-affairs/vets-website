import React from 'react';
import { getAppUrl } from 'platform/utilities/registry-helpers';

const cdpUrl = getAppUrl('combined-debt-portal');
const fsrUrl = getAppUrl('request-debt-help-form-5655');

const ManageVADebtCTA = () => (
  <>
    <va-breadcrumbs>
      <a href="/">Home</a>
      <a href="/manage-va-debt">Manage your VA debt</a>
    </va-breadcrumbs>
    {/* This page is only for local development purposes, on staging/prod
     this page is rendered from the content-build in drupal. */}
    <h1>Manage your VA debt for benefit overpayments and copay bills</h1>
    <p>
      Review your current VA benefit debt or copay bill balances online. And
      find out how to make payments or request help now.
    </p>
    <h2>Review your benefit debt and copay bills online</h2>
    <p>
      <a target="_self" href={cdpUrl} className="vads-c-action-link--green">
        Manage your VA debt
      </a>
    </p>
    <hr />
    <h2>Request help with VA debt (VA Form 5655)</h2>
    <p>
      <a target="_self" href={fsrUrl} className="vads-c-action-link--green">
        Request help with VA debt
      </a>
    </p>
  </>
);

export default ManageVADebtCTA;
