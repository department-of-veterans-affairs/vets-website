import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

export default function TravelClaimsSection() {
  const recordLinkClick = () =>
    recordEvent({
      event: 'nav-link-click',
      'link-label': 'Review and file travel reimbursement claims',
      'link-destination': '/my-health/travel-pay/claims',
    });

  return (
    <div className="vads-u-margin-y--4">
      <h2 id="your-travel-reimbursement-claims">
        Your travel reimbursement claims
      </h2>
      <a
        className="active-va-link"
        href="/my-health/travel-pay/claims"
        onClick={recordLinkClick}
      >
        Review and file travel reimbursement claims
        <va-icon icon="chevron_right" size={3} aria-hidden="true" />
      </a>
      <p className="vads-u-margin-y--0p5">
        File new claims for travel pay and review the status of all your travel
        reimbursement claims.
      </p>
    </div>
  );
}
