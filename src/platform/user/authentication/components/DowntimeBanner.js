import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getBackendStatuses as getBackendStatusAction } from 'platform/monitoring/external-services/actions';
import environment from 'platform/utilities/environment';
import { getStatusFromStatuses } from '../constants';

export function DowntimeBanners({
  shouldGetBackendStatuses,
  getBackendStatuses,
  statuses,
}) {
  const [bannerStatus, setBannerStatus] = useState({});

  useEffect(
    () => {
      if (!environment.isLocalhost() && shouldGetBackendStatuses) {
        getBackendStatuses();
      }
    },
    [shouldGetBackendStatuses, getBackendStatuses],
  );

  useEffect(
    () => {
      if (statuses !== null) {
        const _sorted = getStatusFromStatuses(statuses);
        setBannerStatus(_sorted);
      }
    },
    [setBannerStatus, statuses],
  );

  const shouldRender = Object.keys(bannerStatus).length > 0;
  const { headline, status: alertStatus, message } = bannerStatus;

  return (
    shouldRender && (
      <div className="downtime-notification row">
        <div className="columns small-12">
          <div className="form-warning-banner fed-warning--v2">
            <va-alert visible status={alertStatus}>
              <h2 slot="headline">{headline}</h2>
              {message}
            </va-alert>
          </div>
        </div>
      </div>
    )
  );
}

export const mapStateToProps = state => {
  const { loading, statuses } = state.externalServiceStatuses;
  const shouldGetBackendStatuses = !loading && !statuses;
  return { shouldGetBackendStatuses, statuses };
};

const mapDispatchToProps = { getBackendStatuses: getBackendStatusAction };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DowntimeBanners);
