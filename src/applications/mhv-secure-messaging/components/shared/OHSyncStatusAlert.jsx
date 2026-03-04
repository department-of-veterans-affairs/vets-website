import React from 'react';
import { useSelector } from 'react-redux';
import { Alerts } from '../../util/constants';

const OHSyncStatusAlert = () => {
  const ohSyncStatus = useSelector(state => state.sm?.ohSyncStatus);
  const { data, error } = ohSyncStatus || {};

  // Don't show alert if there's an error fetching status or no data
  if (error || !data) {
    return null;
  }

  // Show alert only when sync is not yet complete
  if (data.syncComplete !== false) {
    return null;
  }

  return (
    <va-alert
      status="warning"
      closeable
      close-btn-aria-label="Close sync status notification"
      data-testid="oh-sync-status-alert"
      class="vads-u-margin-bottom--2"
      data-dd-action-name="OH Sync Status Alert"
    >
      <h2 slot="headline">{Alerts.OHSyncStatus.HEADLINE}</h2>
      <p className="vads-u-margin-bottom--0">{Alerts.OHSyncStatus.BODY}</p>
    </va-alert>
  );
};

export default OHSyncStatusAlert;
