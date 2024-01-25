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
    <h1>Manage your VA debt for benefit overpayments and copay bills</h1>
    <p>
      Review your current VA benefit debt or copay bill balances online. And
      find out how to make payments or request help now.
    </p>
    <h3>Review your benefit debt and copay bills online</h3>
    <a target="_self" href={cdpUrl}>
      Manage your VA debt
    </a>
    <hr />
    <h3>Request help with VA debt (VA Form 5655)</h3>
    <a target="_self" href={fsrUrl}>
      Request help with VA debt
    </a>
  </>
);

export default ManageVADebtCTA;
