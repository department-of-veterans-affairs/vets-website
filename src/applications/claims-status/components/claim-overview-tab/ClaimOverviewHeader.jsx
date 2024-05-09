import React from 'react';

function ClaimOverviewHeader() {
  // TO DO: Add feature flag cst_claim_phases. When enabled we show the below text
  return (
    <div className="claim-overview-header-container">
      <h2 className="vads-u-margin-y--0">Overview of the claim process</h2>
      {/* <p className="vads-u-margin-top--1 vads-u-margin-bottom--4 va-introtext">
        Learn about the VA claim process and what happens after you file your
        claim.
      </p> */}
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--4 va-introtext">
        There are 8 steps in the claim process. It’s common for claims to repeat
        steps 3 to 6 if we need more information.
      </p>
    </div>
  );
}

export default ClaimOverviewHeader;
