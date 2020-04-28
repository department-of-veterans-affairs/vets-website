import React, { useEffect } from 'react';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';

import AccountSecurityContent from './AccountSecurityContent';

const AccountSecurity = () => {
  useEffect(() => {
    focusElement('h2.profile-section-title');
  }, []);

  return (
    <>
      <h2
        tabIndex="-1"
        className="vads-u-margin-y--2 medium-screen:vads-u-margin-y--4 profile-section-title"
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
};

export default AccountSecurity;
