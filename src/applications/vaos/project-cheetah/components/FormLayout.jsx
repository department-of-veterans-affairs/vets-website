import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import ErrorBoundary from '../../components/ErrorBoundary';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import WarningNotification from '../../components/WarningNotification';

export default function FormLayout({ children }) {
  const location = useLocation();
  return (
    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--8">
      <Breadcrumbs>
        <Link to="new-project-cheetah-booking">COVID-19 Vaccination</Link>
      </Breadcrumbs>
      {location.pathname.endsWith('new-project-cheetah-booking') && (
        <DowntimeNotification
          appTitle="VA online scheduling tool"
          isReady
          dependencies={[externalServices.vaosWarning]}
          render={(props, childContent) => (
            <WarningNotification {...props}>{childContent}</WarningNotification>
          )}
        />
      )}
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          <span className="vaos-form__title vaos-u-margin-bottom--1 vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
            COVID-19 vaccination
          </span>
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
