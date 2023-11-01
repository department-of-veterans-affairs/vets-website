import React from 'react';

// eslint-disable-next-line no-unused-vars
export function DownMessaging({ endTime, appTitle }) {
  return `We’re making some updates to the ${appTitle}. We’re sorry it’s not working
  right now. Please check back soon.`;
}

export default function Down() {
  return (
    <va-alert class="vads-u-margin-bottom--4" visible status="warning">
      <h3 slot="headline">This tool is down for maintenance</h3>
      <p>
        We’re making some updates to this tool to help make it even better for
        Veterans, service members, and family members like you. We’re sorry it’s
        not working right now. Please check back soon.
      </p>
    </va-alert>
  );
}
