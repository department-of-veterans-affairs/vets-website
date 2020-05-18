import React, { useEffect } from 'react';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';

import { handleDowntimeForSection } from 'applications/personalization/profile360/components/DowntimeBanner';

import DirectDepositContent from './DirectDepositContent';

const DirectDeposit = () => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

  return (
    <>
      <h2
        tabIndex="-1"
        className="vads-u-line-height--1 vads-u-margin-y--2 medium-screen:vads-u-margin-y--4"
        data-focus-target
      >
        Direct deposit information for disability compensation and pension
        benefits
      </h2>
      <DowntimeNotification
        render={handleDowntimeForSection('direct deposit')}
        dependencies={[externalServices.evss]}
      >
        <DirectDepositContent />
      </DowntimeNotification>
    </>
  );
};

export default DirectDeposit;
