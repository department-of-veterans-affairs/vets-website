import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import Breadcrumbs from '../../components/Breadcrumbs';
import NeedHelp from '../../components/NeedHelp';
import ErrorBoundary from '../../components/ErrorBoundary';
import WarningNotification from '../../components/WarningNotification';

export default function FormLayout({ children, isReviewPage, pageTitle }) {
  const location = useLocation();
  return (
    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2">
      <Breadcrumbs>
        <a href="/my-health/appointments/schedule/type-of-care">{pageTitle}</a>
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

FormLayout.propTypes = {
  children: PropTypes.object,
  isReviewPage: PropTypes.bool,
  pageTitle: PropTypes.string,
};
