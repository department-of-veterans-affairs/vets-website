import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

// eslint-disable-next-line no-unused-vars
export function DownMessaging({ endTime, appTitle }) {
  return (
    <p>
      We’re making some updates to the {appTitle}. We’re sorry it’s not working
      right now. Please check back soon.
    </p>
  );
}

export default function Down() {
  return (
    <AlertBox
      className="vads-u-margin-bottom--4"
      headline={`This tool is down for maintenance.`}
      isVisible
      status="warning"
    >
      <p>
        We’re making some updates to this tool to help make it even better for
        Veterans, service members, and family members like you. We’re sorry it’s
        not working right now. Please check back soon.
      </p>
    </AlertBox>
  );
}
