import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBackendStatuses as getBackendStatusAction } from 'platform/monitoring/external-services/actions';
import environment from 'platform/utilities/environment';
import { getStatusFromStatuses } from '../constants';

export default function DowntimeBanners() {
  const { loading, statuses = [] } = useSelector(
    state => state.externalServiceStatuses,
  );
  const dispatch = useDispatch();
  const isLocalhost = useMemo(() => environment.isLocalhost(), []);
  useEffect(() => {
    if (!loading && !isLocalhost) {
      dispatch(getBackendStatusAction());
    }
  }, []); // only on load

  // mimics the mvi service error if we don't get an OK response from vets-api
  const statusArray =
    statuses || isLocalhost
      ? []
      : [{ service: 'mvi', serviceId: 'mvi', status: 'down' }];
  const bannerStatus = getStatusFromStatuses(statusArray);
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
