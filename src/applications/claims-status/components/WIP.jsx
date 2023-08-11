import React from 'react';

const WIP = () => (
  <va-alert status="warning">
    <h1 slot="headline" className="vads-u-font-size--h3">
      We’re still working on this feature
    </h1>
    <p>
      We’re rolling out the VA Claim Letters page in stages. It’s not quite
      ready yet. Please check back again soon.
    </p>
    <p>
      <a href="/track-claims/your-claims">
        Return to VA Claims and Appeals page
      </a>
    </p>
  </va-alert>
);

export default WIP;
