import React from 'react';
import { useSelector } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';
import { renderMaintenanceWindow, renderDowntimeBanner } from '../downtime';

export default function LogoutAlert() {
  const { statuses = [], maintenanceWindows = [] } = useSelector(
    state => state.externalServiceStatuses,
  );
  const noDowntime =
    !renderDowntimeBanner(statuses) &&
    !renderMaintenanceWindow(maintenanceWindows);
  const isSessionExpired = window.location.href.includes(
    '/?next=loginModal&status=sessionExpired',
  );
  const displaySessionTimeout = isSessionExpired && noDowntime;
  return (
    <>
      {displaySessionTimeout ? (
        <VaAlert closeable={false} showIcon uswds>
          <p slot="headline">
            Your session timed out. Sign in again to continue.
          </p>
        </VaAlert>
      ) : (
        <va-alert status="success" className="vads-u-margin-bottom--6">
          <h2 slot="headline">You have successfully signed out.</h2>
          <strong>Looking for other VA benefits or services?</strong>
          <a
            data-testid="vagov"
            href="/"
            className="vads-u-display--block vads-u-margin-y--1"
            target="_blank"
          >
            VA.gov
          </a>
          <a
            data-testid="mhv"
            href="https://www.myhealth.va.gov"
            className="vads-u-display--block vads-u-margin-y--1"
            target="blank"
          >
            My HealtheVet
          </a>
          <EbenefitsLink className="vads-u-display--block vads-u-margin-y--1">
            eBenefits
          </EbenefitsLink>
        </va-alert>
      )}
    </>
  );
}
