import React from 'react';
import { Toggler } from '~/platform/utilities/feature-toggles';

function ClaimOverviewHeader() {
  return (
    <div className="claim-overview-header-container">
      <h2 className="vads-u-margin-y--0">Overview of the claim process</h2>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.cstClaimPhases}>
        <Toggler.Disabled>
          <p className="vads-u-margin-top--1 vads-u-margin-bottom--4 va-introtext">
            Learn about the VA claim process and what happens after you file
            your claim.
          </p>
        </Toggler.Disabled>
        <Toggler.Enabled>
          <p className="vads-u-margin-top--1 vads-u-margin-bottom--4 va-introtext">
            There are 8 steps in the claim process. It’s common for claims to
            repeat steps 3 to 6 if we need more information.
          </p>
        </Toggler.Enabled>
      </Toggler>
    </div>
  );
}

export default ClaimOverviewHeader;
