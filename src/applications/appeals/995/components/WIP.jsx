import React from 'react';

export const WIP = () => (
  <div className="row vads-u-margin-bottom--5">
    <div className="usa-width-two-thirds medium-8 columns">
      <va-alert status="warning" uswds>
        <h1 slot="headline" className="vads-u-font-size--h3">
          We’re still working on this feature
        </h1>
        <p>
          We’re rolling out the Supplemental Claim Form (20-0995) in stages.
          It’s not quite ready yet. Please check back again soon.
        </p>
        <p>
          <a href="/decision-reviews/supplemental-claim/">
            Return to Supplemental Claim information page
          </a>
        </p>
      </va-alert>
    </div>
  </div>
);
