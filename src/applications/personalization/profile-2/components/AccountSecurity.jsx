import React from 'react';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import AccountSecurityContent from './AccountSecurityContent';

const AccountSecurity = () => (
  <>
    <h2
      tabIndex="-1"
      className="vads-u-margin-y--2 medium-screen:vads-u-margin-y--4"
    >
      Account security
    </h2>
    <DowntimeNotification
      appTitle="Account Security"
      dependencies={[externalServices.emis, externalServices.mvi]}
    >
      <AccountSecurityContent />
    </DowntimeNotification>
  </>
);

export default AccountSecurity;
