import React from 'react';

export const WIP = () => (
  <div className="row vads-u-margin-y--5">
    <div className="usa-width-two-thirds medium-8 columns">
      <va-alert status="warning">
        <h1 slot="headline" className="vads-u-font-size--h3">
          We’re still working on this feature
        </h1>
        <p>
          We’re rolling out the VA home loan Certificate of Eligibility form in
          stages. It’s not quite ready yet. Check back again soon.
        </p>
        <p>
          <a href="/housing-assistance/home-loans/">
            Return to VA-backed Veterans home loans information page
          </a>
        </p>
      </va-alert>
    </div>
  </div>
);
