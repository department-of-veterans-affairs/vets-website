import React from 'react';

const systemDownMessage = (
  <>
    <va-alert id="systemDownMessage" status="warning">
      <h2 slot="headline" className="vads-u-font-size--h3">
        We’re sorry. Our system is temporarily down while we fix a few things.
      </h2>
      <p>Please try again later.</p>
      <p>
        <a href="/">Go back to VA.gov</a>
      </p>
    </va-alert>
    <p />
  </>
);

export default systemDownMessage;
