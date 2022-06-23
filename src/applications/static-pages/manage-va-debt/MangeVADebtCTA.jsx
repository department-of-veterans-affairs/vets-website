import React from 'react';
import { useSelector } from 'react-redux';
import { getAppUrl } from 'platform/utilities/registry-helpers';
// import feature toggle
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

const debtLettersUrl = getAppUrl('your-debt');

const fsrUrl = getAppUrl('request-debt-help-form-5655');

const ManageVADebtCTA = () => {
  const isCombinedPortalActive = useSelector(
    state => toggleValues(state)[FEATURE_FLAG_NAMES.combinedDebtPortalAccess],
  );

  return (
    <>
      <va-breadcrumbs>
        <a href="/">Home</a>
        <a href="/manage-va-debt">Manage your VA debt</a>
      </va-breadcrumbs>
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
        href={
          isCombinedPortalActive
            ? '/manage-debt-and-bills/summary'
            : debtLettersUrl
        }
      >
        Manage your VA debt
      </a>
      <hr />
      <h3>Request help with VA debt (VA Form 5655)</h3>
      <a
        className="usa-button-primary va-button-primary"
        target="_self"
        href={fsrUrl}
      >
        Request help with VA debt
      </a>
    </>
  );
};

export default ManageVADebtCTA;
