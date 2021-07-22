import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { PAGE_NAMES } from '../constants';
import DelayedLiveRegion from '../DelayedLiveRegion';
import MaintenanceAlert from '../components/MaintenanceAlert';

export const Maintenance = () => {
  useEffect(() => {
    recordEvent({
      event: 'howToWizard-alert-displayed',
      'reason-for-alert': 'maintenance alert',
    });
  }, []);

  return (
    <DelayedLiveRegion>
      <MaintenanceAlert />
    </DelayedLiveRegion>
  );
};

export default {
  name: PAGE_NAMES.maintenance,
  component: Maintenance,
};
