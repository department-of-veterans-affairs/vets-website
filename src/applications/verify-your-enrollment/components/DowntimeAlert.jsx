import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function DowntimeAlert() {
  return (
    <div className="vads-u-margin-top--6 vads-u-margin-bottom--8 vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <VaAlert
        close-btn-aria-label="Close notification"
        status="warning"
        visible
      >
        <h2 slot="headline" id="maintenance-alert">
          Scheduled system downtime
        </h2>
        <p>
          Online enrollment verification will be unavailable from{' '}
          <strong>
            Thursday, July 24 at approximately 5:45 a.m. ET through Monday,
            August 4 at 6 a.m. ET.
          </strong>
        </p>
        <p>
          You won't need to verify your enrollment for the month of July.{' '}
          <strong>VA will automatically verify your enrollment for you.</strong>
        </p>
        <p>
          You can log back into VYE on August 4th. If you are enrolled for the
          month of August, you will need to verify your enrollment on or after
          August 31.
        </p>
      </VaAlert>
    </div>
  );
}
