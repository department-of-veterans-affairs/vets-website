import React from 'react';

const TravelClaimsSection = () => (
  <>
    <h2>Your travel claims</h2>
    <a
      className="active-va-link"
      href="https://va.gov/my-health/travel-pay/claims"
    >
      Review and file travel claims
      <va-icon icon="chevron_right" size={3} aria-hidden="true" />
    </a>
    <p>
      File new claims for travel reimbursement and review the status of all your
      travel claims.
    </p>
  </>
);

export default TravelClaimsSection;
