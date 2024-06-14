import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import externalServiceStatus from '~/platform/monitoring/DowntimeNotification/config/externalServiceStatus';
import DashboardWidgetWrapper from './DashboardWidgetWrapper';

const RenderClaimsWidgetDowntimeNotification = (
  { status, endTime },
  children,
) => {
  if (status === externalServiceStatus.down) {
    return (
      <div
        className="vads-u-margin-y--6"
        data-testid="dashboard-section-claims-and-appeals-loader"
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
                    {format(endTime.toDate(), 'PPPp')}
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

RenderClaimsWidgetDowntimeNotification.propTypes = {
  endTime: PropTypes.instanceOf(Date),
  status: PropTypes.string,
};

export default RenderClaimsWidgetDowntimeNotification;
