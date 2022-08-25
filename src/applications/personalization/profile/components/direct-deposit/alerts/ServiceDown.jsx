import React from 'react';

export default function ServiceDown() {
  return (
    <va-alert status="warning" visible>
      <div
        slot="headline"
        className="vads-u-font-size--base vads-u-font-family--sans"
        data-testid="direct-deposit-service-down-alert-headline"
      >
        We’re sorry. Something went wrong on our end. Please refresh this page
        or try again later.
      </div>
    </va-alert>
  );
}
