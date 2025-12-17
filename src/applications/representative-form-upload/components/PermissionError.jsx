import React from 'react';

export default () => (
  <va-alert close-btn-aria-label="Close notification" status="info" visible>
    <h2 id="track-your-status-on-mobile" slot="headline">
      You don't represent this claimant
    </h2>
    <p className="vads-u-margin-y--0">
      This claimant may be in our system, but you can’t access their information
      if you aren't their current representative.
      <va-link href="" text="Learn about establishing representation" />
    </p>
  </va-alert>
);
