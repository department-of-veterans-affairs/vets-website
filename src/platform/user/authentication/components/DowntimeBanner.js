import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBackendStatuses as getBackendStatusAction } from 'platform/monitoring/external-services/actions';
import environment from 'platform/utilities/environment';
import { getStatusFromStatuses } from '../constants';

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
  }, []);

  let downStatus = null;
  let maintenanceStatus = null;
  let bannerStatus = [];

  let statusArray = statuses && !isLocalhost ? statuses : [];

  statusArray =
    statusArray.length === 0 && !isLocalhost
      ? [{ service: 'mvi', serviceId: 'mvi', status: 'down' }]
      : statusArray;

  downStatus =
    statusArray.length > 0 ? getStatusFromStatuses(statusArray) : null;

  if (maintenanceWindows.length > 0) {
    const checkMaintenanceWindow = () => {
      const currentTime = new Date();
      return maintenanceWindows.some(window => {
        const startTime = new Date(window.start_time);
        const endTime = new Date(window.end_time);
        const oneHourBeforeStart = new Date(
          startTime.getTime() - 60 * 60 * 1000,
        );

        return currentTime >= oneHourBeforeStart && currentTime <= endTime;
      });
    };

    const formattedMaintenanceStatus = () => {
      const formattedStatus = maintenanceWindows
        .filter(checkMaintenanceWindow)
        .map(window => ({
          csp: window.external_service,
          status: 'maintenance',
          startTime: window.start_time,
          endTime: window.end_time,
        }));

      return [...formattedStatus];
    };

    maintenanceStatus = checkMaintenanceWindow()
      ? getStatusFromStatuses(formattedMaintenanceStatus())
      : null;
  }

  bannerStatus = [downStatus, maintenanceStatus].filter(
    status => status !== null,
  );

  return (
    !loading && (
      <div className="downtime-notification row">
        <div className="columns small-12">
          {bannerStatus.map(({ headline, status, message }, index) => (
            <div key={index} className="form-warning-banner fed-warning--v2">
              <va-alert visible status={status}>
                <h2 slot="headline">{headline}</h2>
                {message}
              </va-alert>
            </div>
          ))}
        </div>
      </div>
    )
  );
}
