import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBackendStatuses as getBackendStatusAction } from 'platform/monitoring/external-services/actions';
import environment from 'platform/utilities/environment';
import { getStatusFromStatuses } from '../constants';

export default function DowntimeBanners() {
  const { loading, statuses = [] } = useSelector(
    state => state.externalServiceStatuses,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!loading && !environment.isLocalhost()) {
      dispatch(getBackendStatusAction());
    }
  }, []); // only on load

  if (!statuses) return null;
  const bannerStatus = getStatusFromStatuses(statuses);
  if (!Object.keys(bannerStatus).length) return null;
  const { headline, status: alertStatus, message } = bannerStatus;

  return (
    !loading && (
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
