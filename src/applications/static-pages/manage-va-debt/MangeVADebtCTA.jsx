import React from 'react';
import debtLettersManifest from '../../debt-letters/manifest.json';
import fsrManifest from '../../financial-status-report/manifest.json';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

const ManageVADebtCTA = () => {
  return (
    <>
      <Breadcrumbs>
        <a href="/">Home</a>
        <a href="/manage-va-debt">Manage your VA debt</a>
      </Breadcrumbs>
      <h1>Manage your VA debt</h1>
      <p>
        Check the status of debt related to VA disability compensation,
        non-service-connected pension, or education benefits. And make payments
        or request help now if you’d like.
      </p>
      <h3>Check the status of your VA benefit debt</h3>
      <a
        className="usa-button-primary va-button-primary"
        target="_self"
        href={debtLettersManifest.rootUrl}
      >
        Manage your VA debt
      </a>
      <hr />
      <h3>Request help with VA debt (VA Form 5655)</h3>
      <a
        className="usa-button-primary va-button-primary"
        target="_self"
        href={fsrManifest.rootUrl}
      >
        Request help with VA debt
      </a>
    </>
  );
};

export default ManageVADebtCTA;
