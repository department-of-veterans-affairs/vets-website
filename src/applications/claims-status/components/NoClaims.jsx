import React from 'react';

import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

export default function NoClaims() {
  return (
    <div className="usa-alert usa-alert-info claims-alert background-color-only claims-alert-status">
      <h4 className="claims-alert-header usa-alert-heading">
        You do not have any submitted claims
      </h4>
      <p>
        This page shows only completed claim applications. If you started a
        claim but haven’t finished it yet, go to{' '}
        <EbenefitsLink path="ebenefits-portal/ebenefits.portal">
          eBenefits
        </EbenefitsLink>{' '}
        to work on it.
      </p>
    </div>
  );
}
