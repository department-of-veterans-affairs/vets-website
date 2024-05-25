import React from 'react';

export default function LoadFail() {
  return (
    <va-alert
      status="warning"
      visible
      data-testid="service-is-down-banner"
      uswds
      class="vads-u-margin-bottom--2 vads-u-margin-top--9 vads-u-margin-bottom--8"
    >
      <h2 slot="headline">This page isn't available right now.</h2>
      <p>
        We’re sorry. Something went wrong on our end. Refresh this page or try
        again later.
      </p>
    </va-alert>
  );
}
