import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBackendStatuses as getBackendStatusAction } from 'platform/monitoring/external-services/actions';
import environment from 'platform/utilities/environment';
import {
  renderServiceDown,
  renderDowntimeBanner,
  renderMaintenanceWindow,
} from '../downtime';

export default function DowntimeBanners() {
  const { loading, statuses = [], maintenanceWindows = [] } = useSelector(
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
  const isApiDown = () =>
    !isLocalhost && !loading && (!statuses || statuses?.length === 0);

  return (
    <div className="downtime-notification row">
      <div className="columns small-12">
        <div className="form-warning-banner fed-warning--v2">
          {isApiDown() ? renderServiceDown('mvi') : null}
          {renderMaintenanceWindow(maintenanceWindows)}
          {renderDowntimeBanner(statuses)}
        </div>
      </div>
    </div>
  );
}
