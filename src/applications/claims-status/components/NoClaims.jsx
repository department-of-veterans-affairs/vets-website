import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

export default function NoClaims() {
  return (
    <div className="usa-alert usa-alert-info claims-alert background-color-only claims-alert-status">
      <h4 className="claims-alert-header usa-alert-heading">
        You do not have any submitted claims
      </h4>
      <p>
        This page shows only completed claim applications. If you started a
        claim but haven’t finished it yet, go to{' '}
        <a
          href="https://www.ebenefits.va.gov/ebenefits-portal/ebenefits.portal"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            recordEvent({
              event: 'ebenefits-navigation',
            })
          }
        >
          eBenefits
        </a>{' '}
        to work on it.
      </p>
    </div>
  );
}
