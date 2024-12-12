import React from 'react';
import { useSelector } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { renderMaintenanceWindow, renderDowntimeBanner } from '../downtime';

export default function LogoutAlert() {
  const { statuses = [], maintenanceWindows = [] } = useSelector(
    state => state.externalServiceStatuses,
  );
  const noDowntime =
    !renderDowntimeBanner(statuses) &&
    !renderMaintenanceWindow(maintenanceWindows);
  const queryParams = new URLSearchParams(window.location.search);
  const isSessionExpired = queryParams.get('status') === 'sessionExpired';
  const displaySessionTimeout = isSessionExpired && noDowntime;
  return (
    <>
      {displaySessionTimeout ? (
        <VaAlert closeable={false} showIcon slim uswds>
          <p className="vads-u-margin-y--0">
            Your session timed out. Sign in again to continue.
          </p>
        </VaAlert>
      ) : null}
    </>
  );
}
