import React from 'react';

const AuthContext = () => (
  <>
    <p>
      You can file a claim online through the Beneficiary Travel Self Service
      System (BTSSS).
    </p>
    <va-link-action
      href="https://dvagov-btsss.dynamics365portals.us/signin"
      text="Go to BTSSS to file a claim"
    />
    <p>You can also check your travel claim status here on VA.gov</p>
    <va-link-action
      type="secondary"
      href="/my-health/travel-claim-status"
      text="Check your travel claim status"
    />
  </>
);

export default AuthContext;
