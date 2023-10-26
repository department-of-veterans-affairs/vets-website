import React from 'react';

import { OnThisPageLink } from './OnThisPageLink';

export default function OnThisPage() {
  return (
    <div className="usa-width-one-third">
      <h2 className="vads-u-font-size--h3">On this page</h2>
      <OnThisPageLink
        text="Your combined disability rating"
        link="#combined-rating"
      />
      <OnThisPageLink
        text="Your individual ratings"
        link="#individual-ratings"
      />
      <OnThisPageLink text="Learn about VA disabilities" link="#learn" />
    </div>
  );
}
