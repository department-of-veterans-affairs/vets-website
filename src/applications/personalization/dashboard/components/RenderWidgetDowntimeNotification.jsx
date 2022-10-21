import React from 'react';
import externalServiceStatus from '~/platform/monitoring/DowntimeNotification/config/externalServiceStatus';
import DashboardWidgetWrapper from './DashboardWidgetWrapper';

export const RenderClaimsWidgetDowntimeNotification = (downtime, children) => {
  if (downtime.status === externalServiceStatus.down) {
    return (
      <div
        className="vads-u-margin-y--6"
        data-testid="dashboard-section-claims-and-appeals-loader-v2"
      >
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          Claims and appeals
        </h2>
        <div className="vads-l-row">
          <DashboardWidgetWrapper>
            <div className="vads-u-margin-bottom--2p5">
              <va-alert status="error">
                <h2 slot="headline">
                  We can’t access any claims or appeals information right now
                </h2>
                <div>
                  <p>
                    We’re sorry. We’re working to fix some problems with the
                    claims or appeals tool right now and cannot display your
                    information on this page. Please check back after{' '}
                    {downtime.endTime.format('MMMM D [at] LT')}
                  </p>
                </div>
              </va-alert>
            </div>
          </DashboardWidgetWrapper>
        </div>
      </div>
    );
  }
  return children;
};
