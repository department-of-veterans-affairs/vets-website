import React from 'react';

const VeteranStatusPageLevelError = () => {
  return (
    <va-alert
      class="vads-u-margin-bottom--4"
      status="warning"
      visible
      data-testid="veteran-status-page-level-error"
      uswds
    >
      <h2 slot="headline">This page isn’t working right now</h2>
      <p>
        We’re sorry. Something went wrong on our end. Refresh this page or try
        again later.
      </p>
    </va-alert>
  );
};

export default VeteranStatusPageLevelError;
