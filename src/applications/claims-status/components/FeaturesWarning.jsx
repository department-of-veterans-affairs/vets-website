import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

export default function FeaturesWarning() {
  return (
    <div>
      <h2 className="help-heading">Additional services</h2>
      <p>
        To update your personal information, get help filing claims or appeals,
        or view your uploaded documents, go to{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ebenefits.va.gov/ebenefits-portal/ebenefits.portal"
          onClick={() =>
            recordEvent({
              event: 'nav-ebenefits-click',
            })
          }
        >
          eBenefits
        </a>
        .
      </p>
    </div>
  );
}
