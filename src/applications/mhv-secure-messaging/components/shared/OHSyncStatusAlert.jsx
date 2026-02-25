import React from 'react';
import { useSelector } from 'react-redux';

const OHSyncStatusAlert = () => {
  const ohSyncStatus = useSelector(state => state.sm?.ohSyncStatus);
  const { data, error } = ohSyncStatus || {};

  // Don't show alert if there's an error fetching status or no data
  if (error || !data) {
    return null;
  }

  // Show alert for STARTED, NOT_STARTED, IN_PROGRESS, ERROR statuses
  // Hide alert for FINISHED status
  const showStatuses = ['STARTED', 'NOT_STARTED', 'IN_PROGRESS', 'ERROR'];
  const shouldShowAlert = showStatuses.includes(data.status);

  if (!shouldShowAlert) {
    return null;
  }

  return (
    <va-alert
      status="warning"
      closeable
      close-btn-aria-label="Close sync status notification"
      data-testid="oh-sync-status-alert"
      class="vads-u-margin-bottom--2"
    >
      <h2 slot="headline">We’re still adding some of your messages here</h2>
      <p className="vads-u-margin-bottom--0">
        We’re working to add all of your messages to your inbox. They should be
        available soon.
      </p>
    </va-alert>
  );
};

export default OHSyncStatusAlert;
