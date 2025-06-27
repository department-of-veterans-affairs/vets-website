import React from 'react';

const AppIsDown = () => (
  <va-alert class="vads-u-margin-bottom--4" visible status="warning">
    <h3 slot="headline">This application is down for maintenance</h3>
    <p>
      {`We’re making some updates to this tool. We’re sorry it’s not working
      right now. Please check back soon.`}
    </p>
  </va-alert>
);

export default AppIsDown;
