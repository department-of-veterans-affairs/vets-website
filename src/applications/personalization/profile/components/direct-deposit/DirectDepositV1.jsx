import React, { useEffect } from 'react';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';

import { handleDowntimeForSection } from '../alerts/DowntimeBanner';

import FraudVictimAlert from './FraudVictimAlert';
import BankInfoCNP from './BankInfoCNP';
import DirectDepositEDU from './DirectDepositEDUEbenefits';

const DirectDeposit = () => {
  useEffect(() => {
    focusElement('[data-focus-target]');
    document.title = `Direct Deposit | Veterans Affairs`;
  }, []);

  return (
    <>
      <h2
        tabIndex="-1"
        className="vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
        data-focus-target
      >
        Direct deposit information
      </h2>
      <DowntimeNotification
        appTitle="direct deposit"
        render={handleDowntimeForSection(
          'direct deposit for compensation and pension',
        )}
        dependencies={[externalServices.evss]}
      >
        <BankInfoCNP />
      </DowntimeNotification>
      <FraudVictimAlert />
      <DirectDepositEDU />
    </>
  );
};

export default DirectDeposit;
