import React from 'react';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';

export default function TravelClaimsSection() {
  const handler = {
    recordLinkClick: () => {
      recordEvent({
        event: 'nav-link-click',
        'link-label': 'Review and file travel claims',
        'link-destination': '/my-health/travel-pay/claims',
      });
    },
  };

  return (
    <>
      <h2>Your travel claims</h2>
      <a
        className="active-va-link"
        href="/my-health/travel-pay/claims"
        onClick={handler.recordLinkClick}
      >
        Review and file travel claims
        <va-icon icon="chevron_right" size={3} aria-hidden="true" />
      </a>
      <p>
        File new claims for travel reimbursement and review the status of all
        your travel claims.
      </p>
    </>
  );
}
