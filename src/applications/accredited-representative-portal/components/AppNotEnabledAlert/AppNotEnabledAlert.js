import React from 'react';

const AppNotEnabledAlert = () => (
  <div className="vads-u-margin-y--5 vads-l-grid-container large-screen:vads-u-padding-x--0">
    <div className="vads-l-row">
      <va-alert
        class="arp-full-width-alert"
        data-testid="app-not-enabled-alert"
        status="info"
        visible
      >
        <h2 data-testid="app-not-enabled-alert-heading" slot="headline">
          The Accredited Representative Portal is not available yet
        </h2>
      </va-alert>
    </div>
  </div>
);

export default AppNotEnabledAlert;
