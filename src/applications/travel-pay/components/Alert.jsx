import React from 'react';

export default function Alert() {
  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="info"
      uswds
      visible
    >
      <h2 id="track-your-status-on-mobile" slot="headline">
        Track your claim or appeal on your mobile device
      </h2>
      <p className="vads-u-margin-y--0">
        Lorem ipsum dolor sit amet{' '}
        <a className="usa-link" href="/">
          consectetur adipiscing
        </a>{' '}
        elit sed do eiusmod.
      </p>
    </va-alert>
  );
}
