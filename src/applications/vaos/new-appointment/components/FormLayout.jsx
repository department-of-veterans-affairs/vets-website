import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import NeedHelp from '../../components/NeedHelp';
import ErrorBoundary from '../../components/ErrorBoundary';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import WarningNotification from '../../components/WarningNotification';

export default function FormLayout({ children, isReviewPage }) {
  const location = useLocation();
  return (
    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2">
      <Breadcrumbs>
        <Link to="new-appointment">New appointment</Link>
      </Breadcrumbs>
      {location.pathname.endsWith('new-appointment') && (
        <DowntimeNotification
          appTitle="VA online scheduling tool"
          dependencies={[externalServices.vaosWarning]}
          render={(props, childContent) => (
            <WarningNotification {...props}>{childContent}</WarningNotification>
          )}
        />
      )}
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          {!isReviewPage && (
            <span className="vaos-form__title vaos-u-margin-bottom--1 vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
              New appointment
            </span>
          )}
          <ErrorBoundary>{children}</ErrorBoundary>
          <NeedHelp />
        </div>
      </div>
    </div>
  );
}
