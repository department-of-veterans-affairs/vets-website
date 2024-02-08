import React from 'react';

const ServerErrorAlert = () => (
  <va-alert status="error" data-testid="hca-server-error-alert">
    <h2 slot="headline">Something went wrong on our end</h2>
    <p>We’re sorry. Something went wrong on our end. Please try again.</p>
  </va-alert>
);

export default ServerErrorAlert;
