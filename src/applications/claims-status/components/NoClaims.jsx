import React from 'react';

import ebenefitsLink from 'platform/site-wide/ebenefits/containers/ebenefitsLink';

export default function NoClaims() {
  return (
    <div className="usa-alert usa-alert-info claims-alert background-color-only claims-alert-status">
      <h4 className="claims-alert-header usa-alert-heading">
        You do not have any submitted claims
      </h4>
      <p>
        This page shows only completed claim applications. If you started a
        claim but haven’t finished it yet, go to{' '}
        <ebenefitsLink path="ebenefits-portal/ebenefits.portal">
          eBenefits
        </ebenefitsLink>{' '}
        to work on it.
      </p>
    </div>
  );
}
