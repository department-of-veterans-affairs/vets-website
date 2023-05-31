import React from 'react';

export const WIP = () => (
  <div className="row vads-u-margin-bottom--5">
    <div className="usa-width-two-thirds medium-8 columns">
      <va-alert status="warning">
        <h1 slot="headline" className="vads-u-font-size--h3">
          We’re still working on this feature
        </h1>
        <p>
          We’re rolling out the Authorization to the release non-VA medical
          information to VA (VA Forms 21-4142 and 21-4142a) in stages. It’s not
          quite ready yet. Please check back again soon.
        </p>
        <p>
          <a href="/">Return to VA home page</a>
        </p>
      </va-alert>
    </div>
  </div>
);
