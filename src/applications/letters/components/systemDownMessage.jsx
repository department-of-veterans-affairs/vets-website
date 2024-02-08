import React from 'react';

const systemDownMessage = (
  <>
    <va-alert id="systemDownMessage" status="warning" uswds="false">
      <h3 slot="headline">
        We’re sorry. Our system is temporarily down while we fix a few things.
      </h3>
      <p>Please try again later.</p>
      <p>
        <a href="/">Go back to VA.gov</a>
      </p>
    </va-alert>
    <p />
  </>
);

export default systemDownMessage;
