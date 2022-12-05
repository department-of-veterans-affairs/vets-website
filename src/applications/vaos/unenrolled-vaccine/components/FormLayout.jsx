import React from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import Breadcrumbs from '../../components/Breadcrumbs';
import ErrorBoundary from '../../components/ErrorBoundary';
import WarningNotification from '../../components/WarningNotification';

export default function FormLayout({ children }) {
  const location = useLocation();
  const match = useRouteMatch();
  return (
    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--8">
      <Breadcrumbs>
        <a href={match.url}>COVID-19 vaccine</a>
      </Breadcrumbs>
      {location.pathname.endsWith(match.url) && (
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
            COVID-19 vaccine
          </span>
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

FormLayout.propTypes = {
  children: PropTypes.array,
  isReviewPage: PropTypes.bool,
};
